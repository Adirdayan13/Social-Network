DROP TABLE IF EXISTS reset;

CREATE TABLE reset(
    id SERIAL PRIMARY KEY,
    email VARCHAR(300) NOT NULL,
    emailcode VARCHAR(300) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
