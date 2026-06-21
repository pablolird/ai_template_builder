-- TODO: Verify exact field requirements against Paraguay SIFEN/SET invoice specification.
-- Current fields cover common Paraguayan invoice (factura) data; adjust when spec is confirmed.
CREATE TABLE presets (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  business_name VARCHAR(255),
  ruc         VARCHAR(50),
  timbrado    VARCHAR(50),
  address     TEXT,
  city        VARCHAR(100),
  phone       VARCHAR(50),
  email       VARCHAR(255),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
