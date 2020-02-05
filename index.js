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

app.get("/welcome", function(req, res) {
    console.log("*************************** GET WELCOME");
    console.log("resq.session.userId: ", req.session.userId);
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    console.log("*************************** regsiter POST !");
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    console.log("req.body: ", req.body);

    if (req.body == {}) {
        console.log("empty fields in registeraion req.body == {}");
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
                res.json({ success: false });
            });
    }
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("*************************** POST upload");
    let email = req.session.email;
    const imageUrl = s3Url + req.file.filename;
    if (req.file) {
        db.updateImage(email, imageUrl)
            .then(function(results) {
                res.json(imageUrl);
            })
            .catch(function(err) {
                console.log("error from POST upload :", err);
                res.sendStatus(500);
            });
    }
});

app.post("/upload-album", uploader.single("file"), s3.upload, (req, res) => {
    const user_id = req.session.userId;
    const imageUrl = s3Url + req.file.filename;
    console.log("req.session from upload/album: ", req.session);
    if (req.file) {
        db.addPictureToAlbums(user_id, imageUrl)
            .then(() => {
                res.json(imageUrl);
            })
            .catch(err => {
                console.log("error from upload-album: ", err);
            });
    }
});

app.get("/pictures", (req, res) => {
    console.log("******************** GET pictures");
    const user_id = req.session.userId;
    console.log(user_id);
    db.getPicture(user_id)
        .then(results => {
            console.log("results from get pictures: ", results);
            res.json(results.rows);
        })
        .catch(err => {
            console.log("Error from get pictures: ", err);
        });
});

app.post("/edit", (req, res) => {
    let email = req.body.email;
    let first = req.body.first;
    let last = req.body.last;
    let id = req.body.id;

    console.log("req.body from POST /edit: ", req.body);
    db.updateProfile(id, email, first, last)
        .then(results => {
            req.session.email = email;
            res.json({ success: true, email: email, first: first, last: last });
        })
        .catch(err => {
            console.log("error from updateProfile: ", err);
            res.json({ success: false });
        });
});

app.post("/logout", (req, res) => {
    console.log("*************************** POST logout");
    req.session = undefined;
    console.log("req.session from logout:", req.session);
    // res.redirect("/");
    res.json({ logout: true });
});

app.post("/bio", (req, res) => {
    console.log("*************************** POST bio");
    console.log("req.body: ", req.body);
    let email = req.session.email;
    let bio = req.body.bio;
    db.updateBio(email, bio)
        .then(results => {
            res.json({ success: true });
        })
        .catch(err => {
            console.log("error from post bio: ", err);
        });
});

app.post("/login", function(req, res) {
    console.log("*************************** POST login");
    const email = req.body.email;
    const password = req.body.password;
    console.log("email: ", email);
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
    console.log("*************************** POST reset/start");
    const secretCode = cryptoRandomString({
        length: 6
    });
    let email = req.body.email;
    db.getUser(email)
        .then(results => {
            // console.log("results from getuser: ", results);
            const first = results.rows[0].first;
            if (results.rows[0] == undefined) {
                res.json({ success: false });
            } else {
                db.deleteEmailAndCode(email)
                    .then(() => {
                        db.reset(email, secretCode)
                            .then(resultReset => {
                                console.log(
                                    "results from db.reset: ",
                                    resultReset
                                );
                                let emailCode = resultReset.rows[0].emailcode;
                                ses.sendEmail(
                                    "jade.player+funky@spicedling.email",
                                    emailCode,

                                    `Hello ${first}, Here is your code to reset your account`
                                )
                                    .then(() => {
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
    console.log("*************************** POST reset/verify");
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
    console.log("*************************** GET user");
    let email = req.session.email;
    // console.log("req.session from get user: ", req.session);
    db.getUser(email)
        .then(results => {
            // console.log("results from get user: ", results.rows[0]);
            results.rows[0].password = "***** hehe";
            res.json(results.rows[0]);
        })
        .catch(err => {
            console.log("error from GET user: ", err);
        });
});

app.get("/user/:id.json", (req, res) => {
    console.log("********************* GET user/:id.json");
    console.log("id: ", req.session.userId);
    console.log("req.params.id: ", req.params.id);
    db.getUserById(req.params.id)
        .then(results => {
            const userInfo = results.rows[0];
            // console.log("results from getUserById: ", results.rows[0]);
            results.rows[0].password = "******";
            res.json({ userInfo: userInfo, currentId: req.session.userId });
        })
        .catch(err => {
            console.log("error in getUserById: ", err);
        });
});

app.get("/users/:first.json", (req, res) => {
    console.log("**************** GET users/:first");
    console.log("req.params.first: ", req.params.first);
    db.getUserByName(req.params.first)
        .then(results => {
            console.log("results from GET users/:first.json: ", results.rows);
            res.json(results.rows);
        })
        .catch(err => {
            console.log("error from GET users/:first.json: ", err);
        });
});

app.get("/users/newestUsers", (req, res) => {
    console.log("***************** GET users/newestUsers");
    db.newestUsers()
        .then(results => {
            console.log("results from newestUsers: ", results.rows);
            res.json(results.rows);
        })
        .catch(err => {
            console.log("error from GET newestUsers: ", err);
        });
});

app.get("/friends-status/:recipient_id.json", (req, res) => {
    console.log("***************** GET friends-status/:id");
    console.log("viewedUser: ", req.params.recipient_id);
    console.log("logedInUser: ", req.session.userId);
    let viewedUser = req.params.recipient_id;
    let logedInUser = req.session.userId;
    db.getFriends(viewedUser, logedInUser)
        .then(results => {
            console.log("results from GET friends-status: ", results.rows);
            // console.log("sender: ", results.rows[0].sender_id);
            // console.log("recipient: ", results.rows[0].recipient_id);
            if (results.rows == 0) {
                console.log("no friends");
                res.json({ success: true, btnText: "Send friend request" });
            } else if (results.rows[0].accepted == false) {
                console.log("Cancel friend request");
                console.log("logedInUser: ", logedInUser);
                console.log("viewedUser: ", viewedUser);
                console.log("results.rows[0]: ", results.rows[0]);

                if (logedInUser == results.rows[0].sender_id) {
                    console.log("we are in if");
                    res.json({
                        success: true,
                        btnText: "Cancel friend request"
                    });
                } else if (logedInUser == results.rows[0].recipient_id) {
                    console.log("we are in else if");
                    res.json({
                        success: true,
                        btnText: "Accept friend request"
                    });
                }
            } else if (results.rows[0].accepted) {
                console.log("friends !");
                res.json({ success: true, btnText: "Unfriend" });
            }
        })
        .catch(err => {
            console.log("error from GET friends-status: ", err);
            res.json({ success: false, btnText: "Send friend request" });
        });
});

app.post("/friends-status/:recipient_id.json", (req, res) => {
    console.log("****************** POST friends-status/:id");
    let recipient_id = req.params.recipient_id;
    let sender_id = req.session.userId;
    db.addFriends(recipient_id, sender_id)
        .then(results => {
            console.log(
                "results from POST friends-status/:recipient_id: ",
                results
            );
            res.json({ success: true, btnText: "Cancel friend request" });
        })
        .catch(err => {
            console.log("error from POST friends-status/:recipient_id: ", err);
        });
});

app.post("/friends-status/cancel/:recipient_id.json", (req, res) => {
    console.log("******************** POST friends-status-cancel");
    let recipient_id = req.params.recipient_id;
    let sender_id = req.session.userId;
    db.deleteRequest(recipient_id, sender_id)
        .then(results => {
            console.log("results from cancel request: ", results);
            res.json({ success: true, btnText: "Send friend request" });
        })
        .catch(err => {
            console.log("error in cancel: ", err);
        });
});

//////////
// LAST rounte in app !
app.get("*", function(req, res) {
    console.log("*************************** GET *");
    if (!req.session.userId) {
        console.log("*************************** REDIRECT TO WELCOME");
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening 808(0).");
});
