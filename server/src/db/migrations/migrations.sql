CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  accounttype VARCHAR(255) NOT NULL,
  appointments JSONB,
  scanresults JSONB,
  createdat TIMESTAMP DEFAULT NOW(),
  updatedat TIMESTAMP DEFAULT NOW()
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(15) NOT NULL DEFAULT 'scheduled'
);

CREATE TABLE scanresults (
  id SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL,
  date TIMESTAMP NOT NULL,
  result TEXT NOT NULL,
  aianalysis TEXT NOT NULL
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL,
  appointments JSONB,
  role VARCHAR(255) NOT NULL DEFAULT 'admin',
  status VARCHAR(15) NOT NULL DEFAULT 'pending',
  createdat TIMESTAMP DEFAULT NOW()
);