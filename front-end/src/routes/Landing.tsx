import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";
import ModeToggle from "@/components/ModeToggle";

// ─── Landing-page translations ────────────────────────────────────────────────

const T = {
  en: {
    navFeatures: "Features",
    navHow: "How it works",
    navPricing: "Pricing",
    navSignIn: "Sign in",
    navCta: "Get started free",
    heroBadge: "Paraguay SIFEN compliant · AI-powered",
    heroLine1: "Generate professional",
    heroLine2: "Paraguay invoices",
    heroLine3: "from a single sentence",
    heroDesc:
      "Describe the invoice you need in natural language. Facturia generates a fully compliant factura — complete with IVA breakdown, RUC, timbrado, and your company logo — in seconds.",
    startFree: "Start for free",
    watchDemo: "Watch the demo",
    trust1: "No invoice knowledge needed",
    trust2: "Instant HTML download",
    trust3: "Free to start",
    demoCaption:
      "Click the play button to see a live walkthrough · best with sound on",
    featTitle: "Everything you need to invoice in Paraguay",
    featDesc:
      "Built for small businesses and freelancers who need professional invoices without the accounting software overhead.",
    f1t: "AI-powered generation",
    f1d: "Just describe the invoice you need — layout, style, items. The AI handles formatting, Paraguay SIFEN compliance, and your company details automatically.",
    f2t: "Paraguay-compliant by default",
    f2d: "Every invoice includes the required IVA breakdown (Exentas, Gravado 5%, Gravado 10%), Condición de Venta field, and timbrado — no manual setup needed.",
    f3t: "Company presets",
    f3d: "Save your RUC, timbrado, logo, address, and contact details once. They're automatically injected into every invoice — including your logo.",
    f4t: "Template library",
    f4d: "Save your best invoice designs and reuse them with one click. Edit in natural language, rename inline, or download as ready-to-use HTML.",
    f5t: "Three languages",
    f5d: "Full EN / ES / PT interface. Switch languages instantly from Settings — every UI string is translated for your team.",
    f6t: "Two AI models",
    f6d: "Choose between DeepSeek V3 for fast generation and DeepSeek R1 Reasoner for complex templates. Switch per-conversation from the input bar.",
    howTitle: "Up and running in under two minutes",
    howDesc:
      "No accounting software knowledge required. If you can describe what you need, Facturia can generate it.",
    s1n: "01",
    s1t: "Set up your company preset",
    s1d: "Enter your business name, RUC, timbrado number, logo, address, and contact details once. Facturia stores them securely and injects them into every invoice automatically.",
    s2n: "02",
    s2t: "Describe your invoice",
    s2d: 'Type a natural-language prompt like "Make a clean invoice for a consulting project, two items at 10% IVA". No forms, no field mapping.',
    s3n: "03",
    s3t: "Preview, save, download",
    s3d: "See a live preview instantly. Save it to your template library, download as HTML, or open in a new tab to print or share.",
    ctaTitle: "Ready to generate your first invoice?",
    ctaDesc:
      "Start with a free trial — no credit card required. Describe your invoice and see Facturia generate it live.",
    ctaBtn: "Get started for free",
    ctaNote: "Free trial · No setup · Instant invoices",
    footerLine: "AI invoice generation for Paraguay.",
    footerSignIn: "Sign in",
    footerRegister: "Register",
  },
  es: {
    navFeatures: "Características",
    navHow: "Cómo funciona",
    navPricing: "Precios",
    navSignIn: "Iniciar sesión",
    navCta: "Comenzar gratis",
    heroBadge: "Compatible con SIFEN de Paraguay · Impulsado por IA",
    heroLine1: "Generá facturas",
    heroLine2: "profesionales de Paraguay",
    heroLine3: "con una sola frase",
    heroDesc:
      "Describí la factura que necesitás en lenguaje natural. Facturia genera una factura completamente válida — con desglose de IVA, RUC, timbrado y el logo de tu empresa — en segundos.",
    startFree: "Empezar gratis",
    watchDemo: "Ver demostración",
    trust1: "Sin conocimientos contables",
    trust2: "Descarga HTML instantánea",
    trust3: "Gratis para empezar",
    demoCaption:
      "Hacé clic en el botón de reproducción para ver la demo en vivo · mejor con sonido activado",
    featTitle: "Todo lo que necesitás para facturar en Paraguay",
    featDesc:
      "Diseñado para pequeñas empresas y freelancers que necesitan facturas profesionales sin la complejidad de un software contable.",
    f1t: "Generación con IA",
    f1d: "Describí la factura que necesitás — diseño, estilo, ítems. La IA se encarga del formato, el cumplimiento SIFEN de Paraguay y los datos de tu empresa automáticamente.",
    f2t: "Compatible con Paraguay por defecto",
    f2d: "Cada factura incluye el desglose de IVA requerido (Exentas, Gravado 5%, Gravado 10%), campo de Condición de Venta y timbrado — sin configuración manual.",
    f3t: "Presets de empresa",
    f3d: "Guardá tu RUC, timbrado, logo, dirección y datos de contacto una sola vez. Se inyectan automáticamente en cada factura que generás.",
    f4t: "Biblioteca de plantillas",
    f4d: "Guardá tus mejores diseños de factura y reutilizalos con un clic. Editarlos en lenguaje natural, renombralos en línea o descargalos como archivos HTML.",
    f5t: "Tres idiomas",
    f5d: "Interfaz completa en EN / ES / PT. Cambiá de idioma al instante desde Configuración — todos los textos están traducidos.",
    f6t: "Dos modelos de IA",
    f6d: "Elegí entre DeepSeek V3 para generación rápida y DeepSeek R1 Reasoner para plantillas complejas. Cambiá por conversación desde la barra de entrada.",
    howTitle: "Listo para usar en menos de dos minutos",
    howDesc:
      "No se requieren conocimientos de software contable. Si podés describir lo que necesitás, Facturia puede generarlo.",
    s1n: "01",
    s1t: "Configurá tu preset de empresa",
    s1d: "Ingresá el nombre de tu empresa, RUC, timbrado, logo, dirección y datos de contacto una sola vez. Facturia los guarda de forma segura e los inyecta automáticamente.",
    s2n: "02",
    s2t: "Describí tu factura",
    s2d: 'Escribí un prompt como "Hacé una factura simple para un proyecto de consultoría de software, dos ítems al 10% de IVA". Sin formularios, sin mapeo de campos.',
    s3n: "03",
    s3t: "Previsualizar, guardar, descargar",
    s3d: "Ves una vista previa de tu factura al instante. Guardala en tu biblioteca de plantillas, descargala como HTML o abrila en una nueva pestaña para imprimir.",
    ctaTitle: "¿Listo para generar tu primera factura?",
    ctaDesc:
      "Comenzá con una prueba gratuita — sin tarjeta de crédito. Describí tu factura y mirá cómo Facturia la genera en vivo.",
    ctaBtn: "Comenzar gratis",
    ctaNote: "Prueba gratuita · Sin configuración · Facturas instantáneas",
    footerLine: "Generación de facturas con IA para Paraguay.",
    footerSignIn: "Iniciar sesión",
    footerRegister: "Registrarse",
  },
  pt: {
    navFeatures: "Funcionalidades",
    navHow: "Como funciona",
    navPricing: "Preços",
    navSignIn: "Entrar",
    navCta: "Começar grátis",
    heroBadge: "Compatível com SIFEN do Paraguai · Powered by IA",
    heroLine1: "Gere faturas profissionais",
    heroLine2: "do Paraguai",
    heroLine3: "com uma única frase",
    heroDesc:
      "Descreva a fatura que precisa em linguagem natural. Facturia gera uma fatura completamente válida — com discriminação de IVA, RUC, timbrado e o logo da sua empresa — em segundos.",
    startFree: "Começar grátis",
    watchDemo: "Ver demonstração",
    trust1: "Sem conhecimentos contábeis",
    trust2: "Download HTML instantâneo",
    trust3: "Grátis para começar",
    demoCaption:
      "Clique no botão de reprodução para ver uma demonstração ao vivo · melhor com o som ligado",
    featTitle: "Tudo que você precisa para faturar no Paraguai",
    featDesc:
      "Criado para pequenas empresas e freelancers que precisam de faturas profissionais sem a complexidade de um software contábil.",
    f1t: "Geração com IA",
    f1d: "Basta descrever a fatura que você precisa — layout, estilo, itens. A IA cuida da formatação, conformidade SIFEN do Paraguai e os dados da sua empresa automaticamente.",
    f2t: "Compatível com Paraguai por padrão",
    f2d: "Cada fatura inclui a discriminação de IVA exigida (Exentas, Gravado 5%, Gravado 10%), campo Condición de Venta e timbrado — sem configuração manual.",
    f3t: "Predefinições de empresa",
    f3d: "Salve seu RUC, timbrado, logo, endereço e dados de contato uma vez. Eles são injetados automaticamente em cada fatura gerada.",
    f4t: "Biblioteca de modelos",
    f4d: "Salve seus melhores designs de fatura e reutilize com um clique. Edite em linguagem natural, renomeie ou baixe como arquivos HTML prontos.",
    f5t: "Três idiomas",
    f5d: "Interface completa em EN / ES / PT. Mude de idioma instantaneamente em Configurações — todos os textos estão traduzidos.",
    f6t: "Dois modelos de IA",
    f6d: "Escolha entre DeepSeek V3 para geração rápida e DeepSeek R1 Reasoner para modelos complexos. Mude por conversa na barra de entrada.",
    howTitle: "Pronto para usar em menos de dois minutos",
    howDesc:
      "Não são necessários conhecimentos de software contábil. Se você consegue descrever o que precisa, Facturia pode gerá-lo.",
    s1n: "01",
    s1t: "Configure sua predefinição de empresa",
    s1d: "Insira o nome da sua empresa, RUC, número de timbrado, logo, endereço e dados de contato uma vez. Facturia os armazena com segurança e os injeta automaticamente.",
    s2n: "02",
    s2t: "Descreva sua fatura",
    s2d: 'Digite um prompt como "Faça uma fatura simples para um projeto de consultoria de software, dois itens com 10% de IVA". Sem formulários, sem mapeamento.',
    s3n: "03",
    s3t: "Visualizar, salvar, baixar",
    s3d: "Veja uma visualização ao vivo da sua fatura instantaneamente. Salve na biblioteca de modelos, baixe como HTML ou abra em uma nova aba para imprimir.",
    ctaTitle: "Pronto para gerar sua primeira fatura?",
    ctaDesc:
      "Comece com um teste gratuito — sem cartão de crédito. Descreva sua fatura e veja o Facturia gerá-la ao vivo.",
    ctaBtn: "Começar grátis",
    ctaNote: "Teste grátis · Sem configuração · Faturas instantâneas",
    footerLine: "Geração de faturas com IA para o Paraguai.",
    footerSignIn: "Entrar",
    footerRegister: "Registrar",
  },
} as const;

type Lang = keyof typeof T;

// ─── Demo constants ────────────────────────────────────────────────────────────

const DEMO_FIELDS = [
  { key: "label", label: "Preset label", value: "Ferretería Lird", half: false },
  { key: "name", label: "Business Name", value: "Ferretería Lird S.R.L.", half: false },
  { key: "ruc", label: "RUC", value: "80123456-5", half: true },
  { key: "timbrado", label: "Timbrado", value: "12345678", half: true },
  { key: "address", label: "Address", value: "Sample street c/ Sample ave", half: false },
  { key: "city", label: "City", value: "Asunción", half: true },
  { key: "phone", label: "Phone", value: "+595 123456789", half: true },
  { key: "email", label: "Email", value: "ferreterialird@hotmail.com", half: false },
];

const PROMPT_TEXT =
  "Create an invoice template for my company called Ferretería Lird, make it simple";

const AI_REPLY =
  "Done! I've generated a clean, simple invoice for Ferretería Lird S.R.L. — your RUC, timbrado and contact details sit in the header, with the standard Paraguay IVA breakdown (Exentas, Gravado 5% and 10%) below. Preview it on the right.";

const DEMO_CHATS = [
  "professional invoice for consulting…",
  "Create a complete invoice format…",
  "Create an incredible invoice",
  "Create a minimal invoice",
  "Create invoice with airline logo…",
  "Create invoice for my agencies…",
];

const LOGO_DATA = `data:image/svg+xml;base64,${btoa(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><rect width="56" height="56" rx="12" fill="#2c3e50"/><text x="28" y="39" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="white">F</text></svg>`
)}`;

const INVOICE_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><style>
body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;margin:0;padding:24px;color:#333;background:#fff}
.invoice{max-width:720px;margin:0 auto;background:#fff}
.header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #2c3e50;padding-bottom:12px;margin-bottom:16px}
.logo-area img{height:56px;width:56px;object-fit:contain}
.company-info{text-align:right}.company-name{font-size:20px;font-weight:700;color:#2c3e50}
.company-details{font-size:11px;color:#555;margin-top:4px;line-height:1.5}
.invoice-title{text-align:center;font-size:17px;font-weight:700;margin:12px 0;color:#2c3e50;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #ccc;padding-bottom:6px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin-bottom:16px}
.info-item{font-size:11px}.info-label{font-weight:700;display:inline-block;width:92px}
.condicion{border:1px solid #2c3e50;padding:3px 10px;display:inline-block;font-weight:700;background:#ecf0f1}
table{width:100%;border-collapse:collapse;margin:10px 0;font-size:11px}
th{background:#2c3e50;color:#fff;padding:8px 5px;text-align:center;font-size:10px;font-weight:600}
td{padding:7px 5px;border-bottom:1px solid #e3e3e3;text-align:right}
td:first-child,td:nth-child(2){text-align:left}
.totals-table{width:55%;margin-left:auto;border:none;margin-top:6px}
.totals-table td{border:none;padding:5px 8px;font-size:12px;text-align:right}
.totals-table .label{text-align:left;color:#555}
.totals-table tr:last-child td{font-weight:700;border-top:2px solid #2c3e50;padding-top:8px;font-size:14px;color:#2c3e50}
.footer{margin-top:28px;border-top:1px solid #ccc;padding-top:10px;font-size:10px;text-align:center;color:#888;line-height:1.6}
</style></head><body><div class="invoice">
<div class="header">
<div class="logo-area"><img src="${LOGO_DATA}" alt="Logo"></div>
<div class="company-info">
<div class="company-name">Ferretería Lird S.R.L.</div>
<div class="company-details">RUC: 80123456-5<br>Timbrado: 12345678<br>Sample street c/ Sample ave, Asunción<br>Tel: +595 123456789</div>
</div></div>
<div class="invoice-title">Factura</div>
<div class="info-grid">
<div>
<div class="info-item"><span class="info-label">Factura N°:</span> 001-001-0000123</div>
<div class="info-item"><span class="info-label">Fecha:</span> 26/06/2026</div>
<div class="info-item"><span class="info-label">Cliente:</span> Cliente Ejemplo S.A.</div>
</div>
<div>
<div class="info-item"><span class="info-label">Condición:</span> <span class="condicion">Contado</span></div>
<div class="info-item"><span class="info-label">Moneda:</span> Guaraníes (PYG)</div>
</div></div>
<table><thead><tr><th>#</th><th>Descripción</th><th>Cant.</th><th>P. Unit.</th><th>Exentas</th><th>Gravado 5%</th><th>Gravado 10%</th><th>Subtotal</th></tr></thead>
<tbody>
<tr><td>1</td><td>Martillo carpintero 500g</td><td>10</td><td>25.000</td><td></td><td></td><td>250.000</td><td>250.000</td></tr>
<tr><td>2</td><td>Caja de clavos 2"</td><td>5</td><td>15.000</td><td></td><td>75.000</td><td></td><td>75.000</td></tr>
<tr><td>3</td><td>Lija para madera #100</td><td>20</td><td>5.500</td><td>110.000</td><td></td><td></td><td>110.000</td></tr>
<tr style="font-weight:700;background:#f7f9fa"><td colspan="4" style="text-align:right">Totales:</td><td>110.000</td><td>75.000</td><td>250.000</td><td>435.000</td></tr>
</tbody></table>
<table class="totals-table">
<tr><td class="label">Total Exentas</td><td>110.000</td></tr>
<tr><td class="label">Total Gravado 5%</td><td>75.000</td></tr>
<tr><td class="label">IVA 5%</td><td>3.750</td></tr>
<tr><td class="label">Total Gravado 10%</td><td>250.000</td></tr>
<tr><td class="label">IVA 10%</td><td>25.000</td></tr>
<tr><td class="label">TOTAL GENERAL</td><td>463.750</td></tr>
</table>
<div class="footer">Ferretería Lird S.R.L. · RUC: 80123456-5 · Timbrado: 12345678 · Vigente 01/01/2026–31/12/2026</div>
</div></body></html>`;

// ─── Web Audio SFX ─────────────────────────────────────────────────────────────

const SFX = (() => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let muted = false;

  function init() {
    if (ctx) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
    master = ctx!.createGain();
    master.gain.value = 0.5;
    master.connect(ctx!.destination);
  }
  function resume() { if (ctx?.state === "suspended") ctx.resume(); }
  function setMuted(m: boolean) { muted = m; if (master) master.gain.value = m ? 0 : 0.5; }

  function env(node: GainNode, t0: number, peak: number, attack: number, decay: number) {
    node.gain.cancelScheduledValues(t0);
    node.gain.setValueAtTime(0, t0);
    node.gain.linearRampToValueAtTime(peak, t0 + attack);
    node.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
  }
  function noise(dur: number): AudioBuffer {
    const len = Math.floor(ctx!.sampleRate * dur);
    const buf = ctx!.createBuffer(1, len, ctx!.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function key() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = noise(0.03);
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass";
    bp.frequency.value = 1700 + Math.random() * 500; bp.Q.value = 1.2;
    const g = ctx.createGain(); src.connect(bp); bp.connect(g); g.connect(master!);
    env(g, t, 0.18, 0.001, 0.03); src.start(t); src.stop(t + 0.05);
  }
  function click() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = "triangle";
    o.frequency.setValueAtTime(620, t); o.frequency.exponentialRampToValueAtTime(320, t + 0.05);
    const g = ctx.createGain(); o.connect(g); g.connect(master!);
    env(g, t, 0.25, 0.001, 0.06); o.start(t); o.stop(t + 0.09);
  }
  function whoosh(up = true) {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = noise(0.5);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 0.8;
    lp.frequency.setValueAtTime(up ? 300 : 1400, t);
    lp.frequency.exponentialRampToValueAtTime(up ? 1500 : 280, t + 0.42);
    const g = ctx.createGain(); src.connect(lp); lp.connect(g); g.connect(master!);
    env(g, t, 0.22, 0.04, 0.42); src.start(t); src.stop(t + 0.5);
  }
  function sfxSend() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(420, t); o.frequency.exponentialRampToValueAtTime(960, t + 0.18);
    const g = ctx.createGain(); o.connect(g); g.connect(master!);
    env(g, t, 0.22, 0.005, 0.2); o.start(t); o.stop(t + 0.25);
  }
  function pop() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(560, t + 0.07);
    const g = ctx.createGain(); o.connect(g); g.connect(master!);
    env(g, t, 0.22, 0.003, 0.09); o.start(t); o.stop(t + 0.13);
  }
  function tick() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = 1200;
    const g = ctx.createGain(); o.connect(g); g.connect(master!);
    env(g, t, 0.05, 0.002, 0.05); o.start(t); o.stop(t + 0.07);
  }
  function chime() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    ([[880, 0], [1320, 0.12]] as [number, number][]).forEach(([f, d]) => {
      const o = ctx!.createOscillator(); o.type = "sine"; o.frequency.value = f;
      const g = ctx!.createGain(); o.connect(g); g.connect(master!);
      env(g, t + d, 0.24, 0.005, 0.55); o.start(t + d); o.stop(t + d + 0.7);
    });
  }
  function appear() {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(523, t); o.frequency.linearRampToValueAtTime(784, t + 0.25);
    const g = ctx.createGain(); o.connect(g); g.connect(master!);
    env(g, t, 0.12, 0.05, 0.3); o.start(t); o.stop(t + 0.4);
  }

  return { init, resume, setMuted, key, click, whoosh, send: sfxSend, pop, tick, chime, appear };
})();

// ─── Demo icons ───────────────────────────────────────────────────────────────

const Ic = {
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  signout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  send: "M22 2 11 13 M22 2l-7 20-4-9-9-4Z",
  chevron: "M6 9l6 6 6-6",
  save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14 21 3",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  replay: "M3 12a9 9 0 1 0 3-6.7 M3 4v4h4",
  pause: "M6 4h4v16H6z M14 4h4v16h-4z",
  play: "M5 3l14 9-14 9z",
  mute: "M11 5 6 9H2v6h4l5 4z M22 9l-6 6 M16 9l6 6",
  unmute: "M11 5 6 9H2v6h4l5 4z M19 12a7 7 0 0 0-3-5.7 M15.5 8.5a3.5 3.5 0 0 1 0 5",
};

function DI({ d, size = 18, sw = 2, style }: { d: string; size?: number; sw?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}>
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  );
}

// ─── Demo CSS (injected once) ─────────────────────────────────────────────────

const DEMO_CSS = `
  .fd-bubble-in { animation: fd-bubble .42s cubic-bezier(.2,.8,.2,1) both; }
  @keyframes fd-bubble { from { opacity:0; transform:translateY(10px) scale(.98); } to { opacity:1; transform:none; } }

  .fd-doc-in { animation: fd-doc .6s cubic-bezier(.2,.8,.2,1) both; }
  @keyframes fd-doc { from { opacity:0; transform:translateY(16px) scale(.985); } to { opacity:1; transform:none; } }

  .fd-pop { animation: fd-pop .42s cubic-bezier(.2,1.5,.4,1) both; }
  @keyframes fd-pop { from { transform:scale(.4); opacity:0; } to { transform:scale(1); opacity:1; } }

  .fd-tab-in { animation: fd-tab .6s cubic-bezier(.2,.8,.2,1) both; }
  @keyframes fd-tab { from { opacity:0; transform:scale(.92) translateY(20px); } to { opacity:1; transform:none; } }

  .fd-beam {
    position:absolute; left:0; right:0; height:70px; top:0; pointer-events:none;
    background:linear-gradient(180deg,transparent,color-mix(in oklch,var(--primary) 24%,transparent) 50%,transparent);
    animation:fd-beam 2.4s cubic-bezier(.45,0,.55,1) infinite;
  }
  @keyframes fd-beam { 0%{transform:translateY(-70px);opacity:0} 12%{opacity:1} 88%{opacity:1} 100%{transform:translateY(440px);opacity:0} }

  .fd-pulse-dot { width:11px; height:11px; border-radius:50%; background:var(--primary); position:relative; flex-shrink:0; }
  .fd-pulse-dot::after { content:""; position:absolute; inset:-5px; border-radius:50%; border:2px solid var(--primary); animation:fd-ring 1.4s ease-out infinite; }
  @keyframes fd-ring { 0%{transform:scale(.5);opacity:.8} 100%{transform:scale(1.5);opacity:0} }

  .fd-caret { display:inline-block; width:2px; height:1.05em; background:var(--primary); margin-left:1px; vertical-align:-2px; animation:fd-blink 1s steps(1) infinite; }
  @keyframes fd-blink { 0%,50%{opacity:1} 50.01%,100%{opacity:0} }

  .fd-skel-card { box-shadow:0 26px 70px -28px color-mix(in oklch,var(--primary) 60%,transparent); }

  .fd-form-scroll { overflow-y: auto; scrollbar-width: none; }
  .fd-form-scroll::-webkit-scrollbar { display: none; }

  .fd-playpulse { animation:fd-playpulse 2.2s ease-in-out infinite; }
  @keyframes fd-playpulse {
    0%,100%{box-shadow:0 14px 60px color-mix(in oklch,var(--primary) 55%,transparent),0 0 0 0 color-mix(in oklch,var(--primary) 45%,transparent)}
    50%{box-shadow:0 14px 60px color-mix(in oklch,var(--primary) 55%,transparent),0 0 0 18px transparent}
  }
  .fd-bounce-dot { animation:fd-bdot 1.2s ease-in-out infinite; }
  @keyframes fd-bdot { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-6px);opacity:1} }
`;

// ─── Demo sub-components ──────────────────────────────────────────────────────

function DemoBubble({ from, children }: { from: "ai" | "user"; children: React.ReactNode }) {
  const ai = from === "ai";
  return (
    <div className="fd-bubble-in" style={{ display: "flex", justifyContent: ai ? "flex-start" : "flex-end" }}>
      <div style={{
        maxWidth: "82%", padding: "14px 18px", borderRadius: 16, fontSize: 15, lineHeight: 1.55,
        background: ai ? "var(--muted)" : "var(--primary)",
        color: ai ? "var(--foreground)" : "var(--primary-foreground)",
        borderTopLeftRadius: ai ? 4 : 16, borderTopRightRadius: ai ? 16 : 4,
        whiteSpace: "pre-wrap",
      }}>{children}</div>
    </div>
  );
}

function DemoTypingDots() {
  return (
    <div className="fd-bubble-in" style={{ display: "flex" }}>
      <div style={{ padding: "16px 20px", borderRadius: 16, borderTopLeftRadius: 4, background: "var(--muted)", display: "flex", gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="fd-bounce-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--muted-foreground)", animationDelay: `${i * 0.16}s` }} />
        ))}
      </div>
    </div>
  );
}

function DemoChatPanel({ userMsg, pending, aiReplyText, aiReplyShow, inputText, caret, sendActive, sendPulse }: {
  userMsg: boolean; pending: boolean; aiReplyText: string; aiReplyShow: boolean;
  inputText: string; caret: boolean; sendActive: boolean; sendPulse: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [userMsg, pending, aiReplyText, aiReplyShow]);

  return (
    <>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "26px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
        <DemoBubble from="ai">
          Hello! I'm Facturia, your AI invoice assistant. Select a preset with your company details, then describe the invoice design you'd like.
        </DemoBubble>
        {userMsg && <DemoBubble from="user">{PROMPT_TEXT}</DemoBubble>}
        {pending && <DemoTypingDots />}
        {aiReplyShow && <DemoBubble from="ai">{aiReplyText}</DemoBubble>}
      </div>
      <div style={{ padding: "16px 22px 12px", flexShrink: 0 }}>
        <div data-zoom="chatInput" style={{
          border: "1px solid var(--border)", borderRadius: 14, background: "var(--card)",
          padding: 14, display: "flex", flexDirection: "column", gap: 12,
          boxShadow: sendActive ? "0 0 0 1px var(--ring)" : "none",
          transition: "box-shadow .25s ease",
        }}>
          <div data-cur="input" style={{
            minHeight: 46, fontSize: 15, lineHeight: 1.5,
            color: !inputText ? "var(--muted-foreground)" : "var(--foreground)", whiteSpace: "pre-wrap",
          }}>
            {!inputText ? "Describe the invoice template you want…" : inputText}
            {caret && <span className="fd-caret" />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, height: 32, padding: "0 10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, color: "var(--foreground)" }}>
              DeepSeek V3 <DI d={Ic.chevron} size={14} style={{ color: "var(--muted-foreground)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, height: 32, padding: "0 10px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13, color: "var(--foreground)" }}>
              Ferretería Lird <DI d={Ic.chevron} size={14} style={{ color: "var(--muted-foreground)" }} />
            </div>
            <div style={{ flex: 1 }} />
            <button data-cur="send" style={{
              borderRadius: 10, height: 40, width: 40, border: "none", cursor: "pointer",
              background: sendActive ? "var(--primary)" : "var(--secondary)",
              color: sendActive ? "var(--primary-foreground)" : "var(--secondary-foreground)",
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: sendActive ? 1 : 0.7,
              transform: sendPulse ? "scale(0.86)" : "scale(1)",
              transition: "transform .15s ease, opacity .25s ease",
            }}>
              <DI d={Ic.send} size={17} />
            </button>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 12.5, color: "var(--muted-foreground)", marginTop: 10 }}>
          Enter to send · Shift+Enter for a new line
        </div>
      </div>
    </>
  );
}

function DemoSkeletonBar({ w, h = 12 }: { w: string | number; h?: number }) {
  return <Skeleton style={{ width: w, height: h, borderRadius: 6 }} />;
}

function DemoPreviewPanel({ mode, showActions }: { mode: "empty" | "loading" | "result"; showActions: boolean }) {
  const rows: [string, string[]][] = [
    ["56%", ["13%", "13%", "13%"]],
    ["50%", ["13%", "13%", "13%"]],
    ["44%", ["11%", "11%", "11%"]],
  ];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, padding: "0 24px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--muted-foreground)" }}>Template Preview</div>
        <div style={{
          display: "flex", gap: 8,
          opacity: showActions ? 1 : 0, transform: showActions ? "translateY(0)" : "translateY(-4px)",
          transition: "opacity .4s ease, transform .4s ease", pointerEvents: showActions ? "auto" : "none",
        }}>
          {[{ d: Ic.save, label: "Save" }, { d: Ic.download, label: "Download" }].map(({ d, label }) => (
            <button key={label} style={{ display: "flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--foreground)", cursor: "pointer", fontSize: 13 }}>
              <DI d={d} size={14} />{label}
            </button>
          ))}
          <button data-cur="openTab" style={{ display: "flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--foreground)", cursor: "pointer", fontSize: 13 }}>
            <DI d={Ic.external} size={14} />Open in new tab
          </button>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        {/* Empty */}
        <div style={{ position: "absolute", inset: 0, opacity: mode === "empty" ? 1 : 0, transition: "opacity .5s ease", pointerEvents: mode === "empty" ? "auto" : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: 40, textAlign: "center" }}>
          <div style={{ width: 92, height: 92, borderRadius: 22, background: "color-mix(in oklch,var(--primary) 14%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
            <DI d={Ic.file} size={42} sw={1.6} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>No template yet</div>
          <div style={{ fontSize: 14.5, color: "var(--muted-foreground)", maxWidth: 440 }}>Describe the invoice you want in the chat and the preview will appear here.</div>
        </div>

        {/* Loading */}
        <div style={{ position: "absolute", inset: 0, opacity: mode === "loading" ? 1 : 0, transition: "opacity .5s ease", pointerEvents: mode === "loading" ? "auto" : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, padding: 40 }}>
          <div className="fd-skel-card" style={{ position: "relative", width: 560, maxWidth: "90%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: "30px 34px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <DemoSkeletonBar w={180} h={18} /><DemoSkeletonBar w={120} h={11} />
              </div>
              <Skeleton style={{ width: 92, height: 34, borderRadius: 10 }} />
            </div>
            <Skeleton style={{ width: "100%", height: 1 }} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: 40 }}>
              {[0, 1].map((c) => (
                <div key={c} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
                  <DemoSkeletonBar w="46%" /><DemoSkeletonBar w="84%" /><DemoSkeletonBar w="60%" /><DemoSkeletonBar w="70%" />
                </div>
              ))}
            </div>
            <Skeleton style={{ width: "100%", height: 1 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {rows.map(([lead, cells], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: lead }}><DemoSkeletonBar w="100%" /></div>
                  <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    {cells.map((cw, j) => <DemoSkeletonBar key={j} w={cw} />)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, alignItems: "flex-end", marginTop: 4 }}>
              <div style={{ display: "flex", gap: 24 }}><DemoSkeletonBar w={70} /><DemoSkeletonBar w={64} /></div>
              <div style={{ display: "flex", gap: 24 }}><DemoSkeletonBar w={70} /><DemoSkeletonBar w={64} /></div>
              <div style={{ display: "flex", gap: 24 }}><DemoSkeletonBar w={54} h={14} /><DemoSkeletonBar w={64} h={14} /></div>
            </div>
            <div className="fd-beam" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span className="fd-pulse-dot" />
            <span style={{ fontSize: 15, fontWeight: 500 }}>Crafting your template</span>
            <span style={{ display: "flex", gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="fd-bounce-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--muted-foreground)", animationDelay: `${i * 0.16}s` }} />
              ))}
            </span>
          </div>
        </div>

        {/* Result */}
        <div style={{ position: "absolute", inset: 0, opacity: mode === "result" ? 1 : 0, transition: "opacity .5s ease", pointerEvents: mode === "result" ? "auto" : "none", background: "color-mix(in oklch,var(--background) 60%,#000)", padding: 28, display: "flex", justifyContent: "center", overflow: "auto" }}>
          {mode === "result" && (
            <div className="fd-doc-in" style={{ width: 760, maxWidth: "100%", height: "fit-content", background: "#fff", borderRadius: 10, boxShadow: "0 18px 60px rgba(0,0,0,0.5)", overflow: "hidden" }}>
              <iframe srcDoc={INVOICE_HTML} title="Invoice preview" style={{ width: "100%", height: 920, border: "none", display: "block", background: "#fff" }} sandbox="allow-same-origin" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function DemoField({ f, visible }: { f: typeof DEMO_FIELDS[0]; visible: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: f.half ? 1 : "auto" }}>
      <label style={{ fontSize: 14, fontWeight: 600 }}>{f.label} <span style={{ color: "var(--destructive)" }}>*</span></label>
      <input readOnly value={visible ? f.value : ""} style={{
        height: 44, borderRadius: 8, border: "1px solid var(--border)", padding: "0 12px",
        background: visible ? "var(--background)" : "var(--card)", color: "var(--foreground)",
        fontSize: 14, transition: "background .2s ease", outline: "none", width: "100%",
      }} />
    </div>
  );
}

function DemoInlineSheet({ open, filled, logoShown }: { open: boolean; filled: number; logoShown: boolean }) {
  const formScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (logoShown && formScrollRef.current) {
      formScrollRef.current.scrollTop = formScrollRef.current.scrollHeight;
    }
  }, [logoShown]);

  const shown = (key: string) => DEMO_FIELDS.findIndex((f) => f.key === key) < filled;
  const fields = DEMO_FIELDS;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 18, opacity: open ? 1 : 0, transition: "opacity .4s ease", pointerEvents: "none" }} />
      <div style={{
        position: "absolute", top: 0, right: 0, height: "100%", width: 420, maxWidth: "60%", zIndex: 19,
        background: "var(--background)", borderLeft: "1px solid var(--border)", boxShadow: "-24px 0 70px rgba(0,0,0,0.45)",
        display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(102%)", transition: "transform .55s cubic-bezier(.5,.05,.2,1)",
      }}>
        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted-foreground)", fontSize: 14 }}>
            <DI d={Ic.chevron} size={16} style={{ transform: "rotate(90deg)" }} /> Back to presets
          </div>
        </div>
        <div style={{ padding: "14px 24px 18px" }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>New preset</div>
          <div style={{ fontSize: 14, color: "var(--muted-foreground)", marginTop: 4 }}>Fill in your company details for Paraguay invoices.</div>
        </div>
        <Separator style={{ margin: 0 }} />
        <div ref={formScrollRef} data-zoom="presetForm" className="fd-form-scroll" style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <DemoField f={fields[0]} visible={shown(fields[0].key)} />
          <Separator />
          <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--muted-foreground)" }}>Company information</div>
          <DemoField f={fields[1]} visible={shown(fields[1].key)} />
          <div style={{ display: "flex", gap: 14 }}>
            <DemoField f={fields[2]} visible={shown(fields[2].key)} />
            <DemoField f={fields[3]} visible={shown(fields[3].key)} />
          </div>
          <DemoField f={fields[4]} visible={shown(fields[4].key)} />
          <div style={{ display: "flex", gap: 14 }}>
            <DemoField f={fields[5]} visible={shown(fields[5].key)} />
            <DemoField f={fields[6]} visible={shown(fields[6].key)} />
          </div>
          <DemoField f={fields[7]} visible={shown(fields[7].key)} />
          <Separator />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--muted-foreground)" }}>Logo</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className={logoShown ? "fd-pop" : ""} style={{ width: 56, height: 56, borderRadius: 10, background: "#f1f1f3", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", padding: 8, opacity: logoShown ? 1 : 0.25 }}>
                {logoShown && <img src={LOGO_DATA} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
              </div>
              <button style={{ height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--secondary)", color: "var(--secondary-foreground)", cursor: "pointer", fontSize: 13 }}>Remove</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, height: 44, padding: "0 14px", border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, color: "var(--muted-foreground)" }}>
              Browse… <span style={{ color: "var(--foreground)", marginLeft: 6 }}>{logoShown ? "logo.svg" : ""}</span>
            </div>
          </div>
        </div>
        <Separator style={{ margin: 0 }} />
        <div style={{ padding: "16px 24px", display: "flex", gap: 12 }}>
          <button data-cur="createPreset" style={{ flex: 1, height: 46, fontSize: 15, borderRadius: 10, border: "none", background: "var(--primary)", color: "var(--primary-foreground)", cursor: "pointer", fontWeight: 500 }}>
            Create preset
          </button>
          <button style={{ height: 46, padding: "0 16px", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--foreground)", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

function DemoCursor({ pos, down, visible, camScale }: { pos: { x: number; y: number }; down: boolean; visible: boolean; camScale: number }) {
  // SVG cursor tip is at (5,3) in a 24x24 viewBox rendered at 26x26px.
  // Inner div is scaled by 1/camScale, so hotspot in stage coords = (5.4/camScale, 3.25/camScale).
  const hx = (5 / 24) * 26 / camScale;
  const hy = (3 / 24) * 26 / camScale;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, zIndex: 40, pointerEvents: "none", transform: `translate(${pos.x - hx}px,${pos.y - hy}px)`, transition: "transform .72s cubic-bezier(.5,.05,.2,1), opacity .4s ease", opacity: visible ? 1 : 0 }}>
      <div style={{ transform: `scale(${(down ? 0.82 : 1) / camScale})`, transformOrigin: "0 0", transition: "transform .12s ease" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" stroke="rgba(0,0,0,.45)" strokeWidth="1.2" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.55))" }}>
          <path d="M5 3l14 9-6 1.2 3.2 6-2.6 1.3-3.2-6L7 19z" />
        </svg>
        {down && <span style={{ position: "absolute", left: 4, top: 4, width: 30, height: 30, marginLeft: -15, marginTop: -15, borderRadius: "50%", border: "2px solid var(--primary)", animation: "fd-ring .5s ease-out" }} />}
      </div>
    </div>
  );
}

function DemoBrowserTab({ shown }: { shown: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, padding: "26px 30px 30px", background: "color-mix(in oklch,var(--background) 50%,#000)", display: shown ? "flex" : "none" }} className={shown ? "fd-tab-in" : ""}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRadius: 12, overflow: "hidden", boxShadow: "0 30px 90px rgba(0,0,0,0.6)", background: "#fff", border: "1px solid rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 16px", background: "#e8e9ec", borderBottom: "1px solid #d6d7db" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: "8px 8px 0 0", padding: "8px 14px", marginBottom: -12, fontSize: 13, color: "#333", border: "1px solid #d6d7db", borderBottom: "none" }}>
            <img src={LOGO_DATA} alt="" style={{ width: 14, height: 14 }} /> Factura — Ferretería Lird
          </div>
          <div style={{ flex: 1, background: "#fff", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "#666", border: "1px solid #d6d7db" }}>
            facturia.app/templates/invoice.html
          </div>
        </div>
        <iframe srcDoc={INVOICE_HTML} title="Full invoice" style={{ flex: 1, width: "100%", border: "none", background: "#fff" }} sandbox="allow-same-origin" />
      </div>
    </div>
  );
}

function DemoSidebar() {
  return (
    <div style={{ width: 240, borderRight: "1px solid var(--border)", background: "var(--sidebar)", display: "flex", flexDirection: "column", height: "100%", flexShrink: 0 }}>
      <div style={{ padding: "16px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary-foreground)", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>P</div>
        <div style={{ minWidth: 0, lineHeight: 1.3 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>pablo2</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>pablo2@gmail.com</div>
        </div>
      </div>
      <div style={{ padding: "4px 8px", flex: 1, overflow: "hidden" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", padding: "8px 8px 4px" }}>Chats</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, fontWeight: 500, fontSize: 14 }}>
          <DI d={Ic.edit} size={16} /> New chat
        </div>
        {DEMO_CHATS.map((c, i) => (
          <div key={i} style={{ padding: "6px 8px", borderRadius: 8, color: "var(--muted-foreground)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c}</div>
        ))}
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", padding: "12px 8px 4px" }}>Templates</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, fontWeight: 500, fontSize: 14 }}>
          <DI d={Ic.doc} size={16} /> My Templates
        </div>
        <div data-cur="presets" style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
          <DI d={Ic.grid} size={16} /> Presets
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--border)", padding: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, fontWeight: 500, fontSize: 14 }}>
          <DI d={Ic.user} size={16} /> Profile
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, fontWeight: 500, fontSize: 14 }}>
          <DI d={Ic.gear} size={16} /> Settings
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, color: "var(--muted-foreground)", fontSize: 14 }}>
          <DI d={Ic.signout} size={16} /> Sign out
        </div>
      </div>
    </div>
  );
}

function DemoTopbar() {
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, padding: "0 18px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--foreground)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}>
          Factur<span style={{ color: "var(--primary)" }}>ia</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{ display: "flex", alignItems: "center", gap: 7, height: 36, padding: "0 12px", borderRadius: 8, border: "none", background: "transparent", color: "var(--foreground)", cursor: "pointer", fontSize: 14 }}>
          <DI d={Ic.edit} size={15} /> New chat
        </button>
        <button style={{ width: 36, height: 36, borderRadius: 8, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--foreground)" }}>
          <DI d={Ic.moon} size={17} />
        </button>
      </div>
    </header>
  );
}

// ─── App Demo (with forwardRef so ScaledDemo can call start()) ────────────────

type Phase = "idle" | "playing" | "ended";
type PreviewMode = "empty" | "loading" | "result";

const INITIAL_STATE = {
  presetOpen: false, filled: 0, logoShown: false,
  inputText: "", caret: false, sendActive: false, sendPulse: false,
  userMsg: false, pending: false, previewMode: "empty" as PreviewMode,
  aiReplyShow: false, aiReplyText: "", showActions: false, newTab: false,
};

const AppDemo = forwardRef<{ start: () => void }, object>(function AppDemo(_, ref) {
  const [s, setSt] = useState(INITIAL_STATE);
  const [cam, setCamSt] = useState({ scale: 1, x: 0, y: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [down, setDown] = useState(false);
  const [curVis, setCurVis] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);

  const camRef = useRef({ scale: 1, x: 0, y: 0 });
  const runRef = useRef(0);
  const pausedRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const set = (patch: Partial<typeof INITIAL_STATE>) =>
    setSt((p) => ({ ...p, ...patch }));
  const setCam = (c: typeof cam) => { camRef.current = c; setCamSt(c); };

  async function wait(ms: number) {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      const rem = end - Date.now();
      await new Promise<void>((r) => setTimeout(r, Math.min(50, rem > 0 ? rem : 0)));
      while (pausedRef.current) await new Promise<void>((r) => setTimeout(r, 50));
    }
  }
  const alive = (id: number) => runRef.current === id;

  function localOf(sel: string) {
    const el = stageRef.current?.querySelector(sel);
    const stage = stageRef.current;
    if (!el || !stage) return null;
    const er = el.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    // Read the actual mid-animation CSS transform so the cursor lands correctly
    // even when called during a camera transition (camRef holds the target, not the current visual).
    const m = new DOMMatrix(getComputedStyle(stage).transform);
    const cx = m.m41, cy = m.m42, sc = m.m11;
    return { x: (er.left + er.width / 2 - sr.left - cx) / sc, y: (er.top + er.height / 2 - sr.top - cy) / sc };
  }

  async function moveTo(sel: string, dur = 740) {
    const p = localOf(sel); if (p) setCursor(p); await wait(dur);
  }

  function zoomTo(sel: string, scale = 1.35) {
    const p = localOf(sel); if (!p || !stageRef.current) return;
    const sr = stageRef.current.getBoundingClientRect();
    setCam({ scale, x: sr.width / 2 - p.x * scale, y: sr.height / 2 - p.y * scale });
  }

  function zoomOut() { setCam({ scale: 1, x: 0, y: 0 }); }

  async function clickAt(id: number) {
    setDown(true); SFX.click(); await wait(150);
    if (!alive(id)) return;
    setDown(false); await wait(120);
  }

  async function typeInto(text: string, id: number, per = 38) {
    for (let i = 1; i <= text.length; i++) {
      if (!alive(id)) return;
      set({ inputText: text.slice(0, i) });
      if (text[i - 1] !== " ") SFX.key();
      await wait(per);
    }
  }

  async function typeReply(text: string, id: number, per = 15) {
    for (let i = 1; i <= text.length; i++) {
      if (!alive(id)) return;
      set({ aiReplyText: text.slice(0, i) });
      if (i % 3 === 0) SFX.key();
      await wait(per);
    }
  }

  async function run() {
    const id = ++runRef.current;
    setSt({ ...INITIAL_STATE });
    setCam({ scale: 1, x: 0, y: 0 }); setCurVis(false); setDown(false);
    pausedRef.current = false; setPaused(false);
    setPhase("playing");
    await wait(500); if (!alive(id)) return;

    setCursor({ x: 200, y: 200 }); setCurVis(true); SFX.appear();
    await wait(650); if (!alive(id)) return;

    await moveTo("[data-cur=presets]", 850); if (!alive(id)) return;
    await clickAt(id); if (!alive(id)) return;
    SFX.whoosh(true); set({ presetOpen: true });
    await wait(700); if (!alive(id)) return;

    zoomTo("[data-zoom=presetForm]", 1.34);
    await wait(950); if (!alive(id)) return;
    await moveTo("[data-zoom=presetForm]", 300); if (!alive(id)) return;
    for (let i = 1; i <= DEMO_FIELDS.length; i++) {
      if (!alive(id)) return; set({ filled: i }); SFX.key(); await wait(180);
    }
    set({ logoShown: true }); SFX.pop();
    await wait(650); if (!alive(id)) return;

    zoomOut(); await wait(800); if (!alive(id)) return;
    await moveTo("[data-cur=createPreset]", 800); if (!alive(id)) return;
    await clickAt(id); if (!alive(id)) return;
    SFX.pop(); SFX.whoosh(false); set({ presetOpen: false });
    await wait(750); if (!alive(id)) return;

    await moveTo("[data-cur=input]", 750); if (!alive(id)) return;
    zoomTo("[data-zoom=chatInput]", 1.5);
    await wait(900); if (!alive(id)) return;
    await clickAt(id); if (!alive(id)) return;
    set({ caret: true }); await wait(220); if (!alive(id)) return;
    await typeInto(PROMPT_TEXT, id, 38); if (!alive(id)) return;
    set({ sendActive: true }); await wait(450); if (!alive(id)) return;

    zoomOut(); await wait(750); if (!alive(id)) return;
    await moveTo("[data-cur=send]", 650); if (!alive(id)) return;
    setDown(true); set({ sendPulse: true }); SFX.send();
    await wait(180); if (!alive(id)) return;
    setDown(false); set({ sendPulse: false, caret: false, inputText: "", sendActive: false, userMsg: true });
    setCurVis(false);
    await wait(550); if (!alive(id)) return;

    set({ pending: true, previewMode: "loading" });
    await wait(650); if (!alive(id)) return;
    zoomTo(".fd-skel-card", 1.32);
    await wait(900); if (!alive(id)) return;
    for (let k = 0; k < 5; k++) { if (!alive(id)) return; SFX.tick(); await wait(440); }
    await wait(300); if (!alive(id)) return;

    zoomOut(); await wait(800); if (!alive(id)) return;
    SFX.chime(); set({ pending: false, previewMode: "result" });
    await wait(800); if (!alive(id)) return;
    set({ aiReplyShow: true });
    await typeReply(AI_REPLY, id, 15); if (!alive(id)) return;
    await wait(400); if (!alive(id)) return;
    set({ showActions: true }); SFX.pop();
    await wait(900); if (!alive(id)) return;

    setCurVis(true);
    await moveTo("[data-cur=openTab]", 800); if (!alive(id)) return;
    await clickAt(id); if (!alive(id)) return;
    SFX.whoosh(true); SFX.chime(); set({ newTab: true }); setCurVis(false);
    await wait(1400); if (!alive(id)) return;
    setPhase("ended");
  }

  useEffect(() => () => { runRef.current = -1; }, []);

  function start() { SFX.init(); SFX.resume(); SFX.setMuted(muted); run(); }
  function toggleMute() { const m = !muted; setMuted(m); SFX.setMuted(m); }
  function togglePause() { const p = !pausedRef.current; pausedRef.current = p; setPaused(p); }

  useImperativeHandle(ref, () => ({ start }));

  const ctrlBtn: React.CSSProperties = {
    width: 38, height: 38, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.14)",
    cursor: "pointer", background: "rgba(20,22,30,0.8)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  return (
    <div className="dark" style={{ height: "100%", background: "#06070b", color: "var(--foreground)", position: "relative", overflow: "hidden" }}>
      {/* Progress bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, zIndex: 70, background: "rgba(255,255,255,0.06)" }}>
        <div key={phase} style={{ height: "100%", background: "var(--primary)", width: phase === "idle" ? "0%" : "100%", transition: phase === "playing" ? "width 30000ms linear" : "none" }} />
      </div>

      {/* Camera stage */}
      <div ref={stageRef} style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${cam.x}px,${cam.y}px) scale(${cam.scale})`, transition: "transform 1s cubic-bezier(.5,.05,.2,1)" }}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <DemoTopbar />
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "240px 360px 1fr", minHeight: 0 }}>
            <DemoSidebar />
            <section style={{ display: "flex", flexDirection: "column", minHeight: 0, borderRight: "1px solid var(--border)" }}>
              <DemoChatPanel
                userMsg={s.userMsg} pending={s.pending}
                aiReplyText={s.aiReplyText} aiReplyShow={s.aiReplyShow}
                inputText={s.inputText} caret={s.caret}
                sendActive={s.sendActive} sendPulse={s.sendPulse}
              />
            </section>
            <section style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
              <DemoPreviewPanel mode={s.previewMode} showActions={s.showActions} />
            </section>
          </div>
        </div>
        <DemoInlineSheet open={s.presetOpen} filled={s.filled} logoShown={s.logoShown} />
        <DemoCursor pos={cursor} down={down} visible={curVis} camScale={cam.scale} />
      </div>

      <DemoBrowserTab shown={s.newTab} />

      {/* Blocks all user clicks/scrolls on demo content; sits below controls (z75) and play overlay (z80) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 65, pointerEvents: "all", cursor: "default" }} />

      {/* Transport controls */}
      {phase !== "idle" && (
        <div style={{ position: "absolute", top: 14, right: 16, zIndex: 75, display: "flex", gap: 8 }}>
          <button onClick={toggleMute} title={muted ? "Unmute" : "Mute"} style={ctrlBtn}>
            <DI d={muted ? Ic.mute : Ic.unmute} size={17} />
          </button>
          {phase === "playing" && (
            <button onClick={togglePause} title={paused ? "Resume" : "Pause"} style={ctrlBtn}>
              <DI d={paused ? Ic.play : Ic.pause} size={17} />
            </button>
          )}
          <button onClick={start} title="Replay" style={ctrlBtn}><DI d={Ic.replay} size={17} /></button>
        </div>
      )}

      {/* Play overlay */}
      {phase === "idle" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 80, background: "rgba(6,7,11,0.82)", backdropFilter: "blur(7px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <button onClick={start} className="fd-playpulse" style={{ width: 96, height: 96, borderRadius: "50%", border: "none", cursor: "pointer", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff"><path d="M7 5l13 7-13 7z" /></svg>
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>From a sentence to a finished invoice</div>
            <div style={{ fontSize: 15, color: "var(--muted-foreground)", marginTop: 8 }}>
              See how Factur<span style={{ color: "var(--primary)" }}>ia</span> works · best with sound on
            </div>
          </div>
        </div>
      )}

      {/* Replay button */}
      {phase === "ended" && (
        <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 75 }}>
          <button onClick={start} style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 20px", borderRadius: 999, border: "none", cursor: "pointer", background: "var(--primary)", color: "#fff", fontSize: 14, fontWeight: 600, boxShadow: "0 8px 30px rgba(0,0,0,0.45)" }}>
            <DI d={Ic.replay} size={16} /> Replay
          </button>
        </div>
      )}
    </div>
  );
});

// ─── Scaled demo wrapper with IntersectionObserver autoplay ───────────────────

const DEMO_W = 1200;
const DEMO_H = 700;

function ScaledDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<{ start: () => void }>(null);
  const [scale, setScale] = useState(1);
  const hasAutoplayed = useRef(false);

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / DEMO_W);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Auto-play when demo scrolls into view (fires once)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAutoplayed.current) {
          hasAutoplayed.current = true;
          setTimeout(() => demoRef.current?.start(), 600);
        }
      },
      { threshold: 0.45 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: DEMO_H * scale, overflow: "hidden" }}>
      <div style={{ width: DEMO_W, height: DEMO_H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <AppDemo ref={demoRef} />
      </div>
    </div>
  );
}

// ─── Landing page sections ────────────────────────────────────────────────────

function LandingNav() {
  const { lang, setLang } = useLanguage();
  const t = (k: keyof typeof T.en) => (T[lang as Lang] ?? T.en)[k];
  const langs: { code: Lang; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "pt", label: "PT" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="font-bold text-xl tracking-tight">
            Factur<span className="text-primary">ia</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">{t("navFeatures")}</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">{t("navHow")}</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">{t("navPricing")}</a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="hidden sm:flex items-center gap-1 mr-2">
            {langs.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`h-7 px-2 rounded text-xs font-medium transition-colors ${lang === code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <ModeToggle />
          <Link to="/login" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
            {t("navSignIn")}
          </Link>
          <Link to="/login" className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            {t("navCta")}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const { lang } = useLanguage();
  const t = (k: keyof typeof T.en) => (T[lang as Lang] ?? T.en)[k];

  return (
    <section className="pt-24 pb-16 text-center px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          {t("heroBadge")}
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
          {t("heroLine1")}<br />
          <span className="text-primary">{t("heroLine2")}</span><br />
          {t("heroLine3")}
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          {t("heroDesc")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login" className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-primary text-primary-foreground text-base font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
            {t("startFree")}
          </Link>
          <a href="#demo" className="inline-flex items-center justify-center h-12 px-8 rounded-xl border border-border text-base font-medium hover:bg-accent transition-colors">
            {t("watchDemo")}
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-12 text-sm text-muted-foreground">
          {[t("trust1"), t("trust2"), t("trust3")].map((label) => (
            <span key={label} className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const { lang } = useLanguage();
  const t = (k: keyof typeof T.en) => (T[lang as Lang] ?? T.en)[k];

  const features = [
    {
      key: "f1",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
      title: t("f1t"), desc: t("f1d"),
    },
    {
      key: "f2",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
      title: t("f2t"), desc: t("f2d"),
    },
    {
      key: "f3",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>,
      title: t("f3t"), desc: t("f3d"),
    },
    {
      key: "f4",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>,
      title: t("f4t"), desc: t("f4d"),
    },
    {
      key: "f5",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>,
      title: t("f5t"), desc: t("f5d"),
    },
    {
      key: "f6",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
      title: t("f6t"), desc: t("f6d"),
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{t("featTitle")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("featDesc")}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.key} className="rounded-2xl border border-border bg-card p-7 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { lang } = useLanguage();
  const t = (k: keyof typeof T.en) => (T[lang as Lang] ?? T.en)[k];

  const steps = [
    { num: t("s1n"), title: t("s1t"), desc: t("s1d") },
    { num: t("s2n"), title: t("s2t"), desc: t("s2d") },
    { num: t("s3n"), title: t("s3t"), desc: t("s3d") },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-muted/40">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{t("howTitle")}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t("howDesc")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
                <span className="text-primary font-bold text-lg">{s.num}</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { lang } = useLanguage();
  const t = (k: keyof typeof T.en) => (T[lang as Lang] ?? T.en)[k];

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{t("ctaTitle")}</h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">{t("ctaDesc")}</p>
        <Link to="/login" className="inline-flex items-center justify-center h-14 px-10 rounded-xl bg-primary text-primary-foreground text-lg font-semibold hover:bg-primary/90 transition-colors shadow-xl shadow-primary/20">
          {t("ctaBtn")}
        </Link>
        <p className="text-sm text-muted-foreground mt-6">{t("ctaNote")}</p>
      </div>
    </section>
  );
}

function LandingFooter() {
  const { lang } = useLanguage();
  const t = (k: keyof typeof T.en) => (T[lang as Lang] ?? T.en)[k];

  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="font-bold text-lg tracking-tight">
          Factur<span className="text-primary">ia</span>
        </div>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Facturia. {t("footerLine")}</p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/login" className="hover:text-foreground transition-colors">{t("footerSignIn")}</Link>
          <Link to="/login" className="hover:text-foreground transition-colors">{t("footerRegister")}</Link>
        </div>
      </div>
    </footer>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Landing() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = DEMO_CSS;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <HeroSection />

      <section id="demo" className="px-6 pb-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
            <ScaledDemo />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {/* Caption comes from the locale of the nearest LandingNav render; repeat lookup here */}
            <DemoCaption />
          </p>
        </div>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}

function DemoCaption() {
  const { lang } = useLanguage();
  return <>{(T[lang as Lang] ?? T.en).demoCaption}</>;
}
