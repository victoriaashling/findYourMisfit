const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const ensure = require('connect-ensure-login');
const db = require("../models");


const path = require("path");
const bodyParser = require("body-parser");

module.exports = function(app) {

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(require("cookie-parser")());
    app.use(require("express-session")({ secret: 'password', resave: false, saveUninitialized: false }));


    passport.use(new Strategy(
        (username, password, cb) => {
            db.User.findOne({ where: {handle: username} }).then((user) => {
                // if (err) {return cb(err)}
                if (!user) {return cb(null, false)}
                if (user.dataValues.password !== password) {return cb(null, false)}
        
                console.log("user: ", user, user.dataValues);
                return cb(null, user);
            })
        })
    );

    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
        db.User.findOne({ where: {id: id} }).then((user) => {
            cb(null, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());


    // app.get("/", (req, res) => {
    //     res.sendFile(path.join(__dirname, "login.html"));
    // });

    app.get("/login", (req, res) => {
        db.User.findAll({}).then(resultData => {
            console.log(resultData);
            res.json(resultData);
        });
    });

    app.post("/newUser", (req, res) => {
        console.log(req.body);
        res.end();
    });

    app.post("/login", passport.authenticate("local", {failureRedirect: "/"}), (req, res) => {
        console.log("success", req.body);
        //  When we get this working, redirect to their specific profile -- /users/:id -- then the get method for this route will bring up their info and available convos
        res.sendFile(path.join(__dirname, "../public/html/success.html"));
    });

    app.get("/profile", ensure.ensureLoggedIn(), (req, res) => {
        res.json({"user": req.user});
    });

}