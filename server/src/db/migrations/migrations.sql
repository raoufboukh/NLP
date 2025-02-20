DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS scanresults;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  accounttype VARCHAR(255) NOT NULL, -- Assurez-vous que cette ligne est présente
  appointments JSONB,
  scanresults JSONB,
  createdat TIMESTAMP DEFAULT NOW(), -- Utiliser "createdat" en minuscules
  updatedat TIMESTAMP DEFAULT NOW()  -- Utiliser "updatedat" en minuscules
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL, -- Utiliser "userid" en minuscules
  date TIMESTAMP NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(15) NOT NULL DEFAULT 'scheduled'
);

CREATE TABLE scanresults (
  id SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL, -- Utiliser "userid" en minuscules
  date TIMESTAMP NOT NULL,
  result TEXT NOT NULL,
  aianalysis TEXT NOT NULL -- Utiliser "aianalysis" en minuscules
);