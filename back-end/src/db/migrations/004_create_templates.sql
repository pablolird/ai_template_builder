-- TODO: Add invoice_size field (e.g. 'A4', 'A3', custom dimensions) once the size
-- selection feature is implemented on the frontend.
CREATE TABLE templates (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preset_id    UUID         REFERENCES presets(id) ON DELETE SET NULL,
  name         VARCHAR(255) NOT NULL,
  html_content TEXT         NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
