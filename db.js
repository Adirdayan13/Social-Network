const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

exports.addUser = function(first, last, email, password) {
    return db.query(
        `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, password]
    );
};

exports.getUser = function(email) {
    return db.query(`SELECT password, id FROM users WHERE email = $1`, [email]);
};

exports.reset = function(email, emailcode) {
    return db.query(
        `INSERT INTO reset (email, emailcode)
        VALUES ($1, $2)
        ON CONFLICT (email)
        DO UPDATE SET emailcode = $2 RETURNING emailcode`,
        [email, emailcode]
    );
};

exports.getResetCode = function(email) {
    return db.query(
        `SELECT * FROM reset WHERE email = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`,
        [email]
    );
};

exports.updatePassword = function(email, password) {
    return db.query(
        `UPDATE users SET email = $1, password = $2 WHERE email = $1`,
        [email, password]
    );
};
