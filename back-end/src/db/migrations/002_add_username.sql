ALTER TABLE users ADD COLUMN username VARCHAR(30) NOT NULL;

-- Case-insensitive unique index so "Alice" and "alice" are treated as the same username
CREATE UNIQUE INDEX idx_users_username_lower ON users(LOWER(username));
