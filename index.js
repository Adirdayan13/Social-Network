const db = require("./db");
const bcrypt = require("./bcrypt");
const csurf = require("csurf");
const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const path = require("path");
///upload
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const { s3Url } = require("./config");
/// /upload
const secretCode = cryptoRandomString({
    length: 6
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(compression());
app.use(express.json());
app.use(express.static("./public"));

app.use(
    cookieSession({
        secret: "secrets",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    // give unique name to each image - random 24 char name
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

///// ROUTES

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("*************** POST upload");
    let email = req.session.email;
    const imageUrl = s3Url + req.file.filename;
    if (req.file) {
        db.updateImage(email, imageUrl)
            .then(function(results) {
                console.log("results: ", results);
                res.json(imageUrl);
            })
            .catch(function(err) {
                console.log("error from POST upload :", err);
                res.sendStatus(500);
            });
    }
});

app.post("/bio", (req, res) => {
    console.log("***************** POST bio");
    console.log("req.body: ", req.body);
    let email = req.session.email;
    let bio = req.body.bio;
    db.updateBio(email, bio)
        .then(results => {
            console.log("results from POST bio: ", results);
            res.json({ success: true });
        })
        .catch(err => {
            console.log("error from post bio: ", err);
        });
});

app.post("/register", (req, res) => {
    console.log("*****************regsiter POST !");
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    console.log("req.body: ", req.body);

    if (req.body == {}) {
        console.log("empty fields in registeraion !req.body.length");
        res.json({ success: false });
    } else if (
        first == "" ||
        last == "" ||
        email == "" ||
        password == "" ||
        first.startsWith(" ") ||
        last.startsWith(" ") ||
        email.startsWith(" ") ||
        password.startsWith(" ")
    ) {
        console.log("empty fields in registeraion");
        res.json({ success: false });
    } else {
        bcrypt
            .hash(password)
            .then(hashedPass => {
                db.addUser(first, last, email, hashedPass, null)
                    .then(results => {
                        console.log("hashedPass: ", hashedPass);
                        req.session.email = email;
                        req.session.userId = results.rows[0].id;
                        res.json({ success: true });
                    })
                    .catch(err => {
                        console.log("error from addUser POST register: ", err);
                        res.json({ success: false });
                    });
            })
            .catch(err => {
                console.log("error from hashedPass: ", err);
            });
    }
});

app.get("/welcome", function(req, res) {
    console.log("************* GET WELCOME");
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/login", function(req, res) {
    console.log("********************POST login");
    const email = req.body.email;
    const password = req.body.password;
    db.getUser(email)
        .then(results => {
            bcrypt
                .compare(password, results.rows[0].password)
                .then(result => {
                    if (result) {
                        req.session.userId = results.rows[0].id;
                        req.session.email = email;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch(err => {
                    console.log("error from bcrypt compare POST login: ", err);
                    res.json({ success: false });
                });
        })
        .catch(err => {
            console.log("error from getUser POST login: ", err);
            res.json({ success: false });
        });
});

app.post("/reset/start", (req, res) => {
    console.log("********************POST reset/start");
    let email = req.body.email;
    db.getUser(email)
        .then(results => {
            if (results.rows[0] == undefined) {
                res.json({ success: false });
            } else {
                db.deleteEmailAndCode(email)
                    .then(result => {
                        console.log("result from deleteEmailAndCode: ", result);
                        db.reset(email, secretCode)
                            .then(resultReset => {
                                let emailCode = resultReset.rows[0].emailcode;
                                ses.sendEmail(
                                    "jade.player+funky@spicedling.email",
                                    emailCode,
                                    "Here is your code to reset your account"
                                )
                                    .then(resultEmailCode => {
                                        console.log(
                                            "results from emailCode: ",
                                            resultEmailCode
                                        );
                                        res.json({ success: true });
                                    })
                                    .catch(err => {
                                        console.log(
                                            "error from sendEmail",
                                            err
                                        );
                                    });
                            })
                            .catch(err => {
                                console.log("error from reset email:", err);
                            });
                    })
                    .catch(err => {
                        console.log("error in deleteEmailAndCode: ", err);
                    });
            }
        })
        .catch(err => {
            console.log("error from POST reset: ", err);
        });
});

app.post("/reset/verify", (req, res) => {
    console.log("********************POST reset/verify");
    let email = req.body.state.email;
    let code = req.body.state.code;
    let newPassword = req.body.state.newpassword;
    console.log("email :", email);
    console.log("code: ", code);
    console.log("newPassword :", newPassword);
    console.log("req.body: ", req.body);
    db.getResetCode(email)
        .then(results => {
            console.log("results from getResetCode: ", results);
            console.log("results from getResetCode: ", results.rows[0]);
            if (results.rows[0].emailcode == code) {
                console.log("there is a match !");
                ///// HASH THE PASSWORD !!!
                bcrypt
                    .hash(newPassword)
                    .then(hashedPass => {
                        console.log("we are in then hahsepass");
                        db.updatePassword(email, hashedPass)
                            .then(results => {
                                console.log(
                                    "results from updatePassword: ",
                                    results
                                );
                                res.json({ success: true });
                            })
                            .catch(err => {
                                console.log("error from updatePassword: ", err);
                            });
                    })
                    .catch(err => {
                        console.log("error from hash pass: ", err);
                    });
            } else {
                res.json({ success: false });
            }
        })
        .catch(err => {
            console.log("error from POST reset/verify getResetCode: ", err);
            res.json({ success: false });
        });
});
//////////
app.get("/user", function(req, res) {
    console.log("********************GET user");
    // console.log("req.session: ", req.session);
    let email = req.session.email;
    db.getUser(email)
        .then(results => {
            results.rows[0].password = "Not today !";
            res.json(results.rows[0]);
        })
        .catch(err => {
            console.log("error from GET user: ", err);
        });
});
//////////
// LAST rounte in app !
app.get("*", function(req, res) {
    console.log("************* GET *");
    if (!req.session.userId) {
        console.log("******* REDIRECT TO WELCOME");
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening 808(0).");
});
