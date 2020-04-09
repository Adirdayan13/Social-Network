DROP TABLE IF EXISTS pictures;

CREATE TABLE pictures(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    picture VARCHAR(300) NOT NULL,
    title VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
