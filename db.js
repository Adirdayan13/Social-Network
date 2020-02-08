const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

exports.addUser = function(first, last, email, password, picture_url, bio) {
    return db.query(
        `INSERT INTO users (first, last, email, password, picture_url, bio)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [first, last, email, password, picture_url || null, bio || null]
    );
};

exports.updateImage = function(email, picture_url) {
    return db.query(
        `UPDATE users SET picture_url = $2
        WHERE email = $1`,
        [email, picture_url]
    );
};

exports.getUser = function(email) {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

exports.getUserById = function(id) {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

exports.reset = function(email, emailcode) {
    return db.query(
        `INSERT INTO reset (email, emailcode)
        VALUES ($1, $2)
        RETURNING emailcode`,
        [email, emailcode]
    );
};

exports.deleteEmailAndCode = function(email) {
    return db.query(`DELETE FROM reset WHERE email = $1`, [email]);
};

exports.getResetCode = function(email) {
    return db.query(
        `SELECT * FROM reset WHERE email = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`,
        [email]
    );
};

exports.updatePassword = function(email, password) {
    return db.query(`UPDATE users SET password = $2 WHERE email = $1`, [
        email,
        password
    ]);
};

exports.updateBio = function(email, bio) {
    return db.query(`UPDATE users SET bio = $2  WHERE email = $1`, [
        email,
        bio
    ]);
};

exports.updateProfile = function(id, email, first, last) {
    return db.query(
        `UPDATE users SET email = $2, first = $3, last = $4 WHERE id = $1`,
        [id, email, first, last]
    );
};

exports.addPictureToAlbums = function(user_id, picture) {
    return db.query(`INSERT INTO pictures (user_id, picture) VALUES ($1, $2)`, [
        user_id,
        picture
    ]);
};

exports.getPicture = function(user_id) {
    return db.query(
        `SELECT picture FROM pictures WHERE user_id = $1 ORDER BY id DESC`,
        [user_id]
    );
};

exports.getUserByName = function(first) {
    return db.query(
        `SELECT id, first, last, picture_url FROM users WHERE first ILIKE $1;`,
        [first + "%"]
    );
};

exports.newestUsers = function() {
    return db.query(
        `SELECT id, first, last, picture_url FROM users ORDER BY id DESC
        LIMIT 3`
    );
};

exports.getFriends = function(recipient_id, sender_id) {
    return db.query(
        `SELECT * FROM friendship
            WHERE (recipient_id = $1 AND sender_id = $2)
            OR (recipient_id = $2 AND sender_id = $1);`,
        [recipient_id, sender_id]
    );
};

exports.addFriends = function(recipient_id, sender_id) {
    return db.query(
        `INSERT INTO friendship (recipient_id, sender_id)
        VALUES ($1, $2)`,
        [recipient_id, sender_id]
    );
};

exports.updateFriends = function(recipient_id, sender_id) {
    return db.query(
        `UPDATE friendship
        SET accepted = true
        WHERE
        recipient_id = $2 AND sender_id = $1`,
        [recipient_id, sender_id]
    );
};

exports.deleteRequest = function(recipient_id, sender_id) {
    return db.query(
        `DELETE FROM friendship WHERE
        recipient_id = $1 AND sender_id = $2
        OR
        recipient_id = $2 AND sender_id = $1`,
        [recipient_id, sender_id]
    );
};

exports.friendsStatus = function(recipient_id) {
    return db.query(
        `SELECT users.id, first, last, picture_url, accepted
         FROM friendship
         JOIN users
         ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
         OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
         OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`,
        [recipient_id]
    );
};
