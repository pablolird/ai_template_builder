import OpenAI from 'openai';

import type { Preset } from '../presets/presets.types.js';
import type { ChatMessage, ChatResponse } from './ai.types.js';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function getClient(): OpenAI {
  return new OpenAI({
    apiKey: requireEnv('DEEPSEEK_API_KEY'),
    baseURL: 'https://api.deepseek.com',
  });
}

function buildSystemPrompt(preset: Preset | null, currentTemplate?: string): string {
  const presetBlock = preset
    ? `
The user has selected the following company preset — inject these values into the invoice template:
- Company name: ${preset.business_name ?? 'Not specified'}
- RUC: ${preset.ruc ?? 'Not specified'}
- Timbrado: ${preset.timbrado ?? 'Not specified'}
- Address: ${preset.address ?? 'Not specified'}
- City: ${preset.city ?? 'Not specified'}
- Phone: ${preset.phone ?? 'Not specified'}
- Email: ${preset.email ?? 'Not specified'}
- Logo: ${preset.logo_data ? 'A company logo is provided. In the invoice header include exactly: <img src="LOGO_PLACEHOLDER" alt="Company logo" style="max-height:60px;max-width:200px;object-fit:contain;">' : 'No logo provided; do not include an <img> for the logo.'}
`
    : 'No company preset selected; use placeholder values for company fields.';

  const editModeBlock = currentTemplate
    ? `
CURRENT TEMPLATE — APPLY A MINIMAL PATCH ONLY:
The user already has a template. Your job is to apply their request as the smallest possible change to the HTML below.

CRITICAL RULES — violating any of these is an error:
- Return the original HTML with ONLY the single requested change applied.
- Do NOT reformat code, reorder properties, rename classes, restructure elements, or clean up whitespace.
- Do NOT add new sections, styles, or features that were not explicitly requested.
- Do NOT "improve" anything you were not asked to change. If it was not mentioned, leave it exactly as-is.
- Think of this as running a precise find-and-replace, not a rewrite.

${currentTemplate}
`
    : '';

  return `You are an expert invoice template designer specializing in Paraguayan invoices (facturas).
When the user asks you to create or modify an invoice template, respond with a JSON object:
{
  "message": "Brief acknowledgment of what you are doing (1 sentence max). Omit if just generating silently.",
  "templateHtml": "A complete, self-contained HTML invoice template with all CSS inlined or in a <style> tag. Must look professional and print-ready."
}

If the user asks a question or makes a purely conversational request (not asking to generate or change the template), respond with:
{
  "message": "Your answer here."
}

Rules:
- Always return valid JSON. Never wrap it in markdown code fences.
- The HTML must be fully self-contained: no external stylesheets or scripts.
- Design for A4 paper (210mm × 297mm) by default unless the user specifies otherwise.
- The template should look like an actual Paraguayan invoice with the proper structure.

MANDATORY Paraguayan invoice requirements — always include these regardless of what the user asks:

1. CONDICIÓN DE VENTA: The invoice must display "Contado" or "Crédito" as a labeled field in the header area. Default to "Contado" as a placeholder.

2. IVA BREAKDOWN: Paraguay has three tax rates. The line items table MUST have separate columns for each:
   - Exentas (tax-exempt amount)
   - Gravado 5% (amount subject to 5% IVA)
   - Gravado 10% (amount subject to 10% IVA)

   Below the line items, include a tax summary block with exactly these rows:
   - Total Exentas
   - Total Gravado 5%  →  IVA 5% (= Gravado 5% × 5%)
   - Total Gravado 10% →  IVA 10% (= Gravado 10% × 10%)
   - Total IVA
   - TOTAL GENERAL (= Exentas + Gravado 5% + Gravado 10% + Total IVA)

   Use realistic placeholder numbers. Each line item row should place its amount in only one of the three tax columns (the other two left blank or zero).
${presetBlock}${editModeBlock}`;
}

// deepseek-reasoner (R1) does not support response_format — only use it for chat models
const SUPPORTS_JSON_FORMAT = new Set(['deepseek-chat']);

export class MessageExtractor {
  private phase: 'seeking' | 'in_value' | 'done' = 'seeking';
  private buffer = '';
  private pos = 0;

  push(chunk: string): string[] {
    if (this.phase === 'done') return [];
    this.buffer += chunk;
    const chars: string[] = [];

    if (this.phase === 'seeking') {
      const search = this.buffer.slice(this.pos);
      const match = search.match(/"message"\s*:\s*"/);
      if (!match) {
        // Keep last 20 chars in case the key spans chunk boundaries
        this.pos = Math.max(0, this.buffer.length - 20);
        return chars;
      }
      this.pos += match.index! + match[0].length;
      this.phase = 'in_value';
    }

    while (this.pos < this.buffer.length) {
      const c = this.buffer[this.pos]!;
      if (c === '\\') {
        if (this.pos + 1 >= this.buffer.length) break; // wait for next chunk
        const next = this.buffer[this.pos + 1]!;
        const escMap: Record<string, string> = { '"': '"', '\\': '\\', n: '\n', r: '\r', t: '\t' };
        chars.push(escMap[next] ?? next);
        this.pos += 2;
      } else if (c === '"') {
        this.phase = 'done';
        this.pos++;
        break;
      } else {
        chars.push(c);
        this.pos++;
      }
    }

    return chars;
  }
}

function extractJson(raw: string): string {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  return fenceMatch ? fenceMatch[1]!.trim() : raw.trim();
}

export { extractJson as extractJsonPublic };

export async function chat(
  messages: ChatMessage[],
  model: string,
  preset: Preset | null,
  currentTemplate?: string,
): Promise<ChatResponse> {
  const client = getClient();
  const systemPrompt = buildSystemPrompt(preset, currentTemplate);

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    ...(SUPPORTS_JSON_FORMAT.has(model) ? { response_format: { type: 'json_object' } } : {}),
  });

  const raw = extractJson(completion.choices[0]?.message.content ?? '{}');

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { message: raw };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { message: raw };
  }

  const obj = parsed as Record<string, unknown>;
  const result: ChatResponse = {
    message: typeof obj['message'] === 'string' ? obj['message'] : undefined,
    templateHtml: typeof obj['templateHtml'] === 'string' ? obj['templateHtml'] : undefined,
  };

  if (preset?.logo_data && result.templateHtml) {
    result.templateHtml = result.templateHtml.replace('LOGO_PLACEHOLDER', preset.logo_data);
  }

  return result;
}

export async function createStream(
  messages: ChatMessage[],
  model: string,
  preset: Preset | null,
  currentTemplate?: string,
) {
  const client = getClient();
  const systemPrompt = buildSystemPrompt(preset, currentTemplate);

  return client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
    ...(SUPPORTS_JSON_FORMAT.has(model) ? { response_format: { type: 'json_object' } } : {}),
  });
}
