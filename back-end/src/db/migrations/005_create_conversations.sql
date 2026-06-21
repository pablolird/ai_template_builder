CREATE TABLE conversations (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preset_id    UUID         REFERENCES presets(id) ON DELETE SET NULL,
  title        VARCHAR(255) NOT NULL DEFAULT 'New Chat',
  template_html TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
