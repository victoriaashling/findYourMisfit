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


    passport.use("local-signin", new Strategy(
        (username, password, cb) => {
            console.log("hello ", username);
            db.User.findOne({ where: {email: username} }).then((user) => {
                // if (err) {return cb(err)}
                if (!user) {return cb(null, false)}
                if (user.dataValues.password !== password) {return cb(null, false)}
        
                console.log("user: ", user.dataValues);
                return cb(null, user);
            })
        })
    );

    passport.use("local-signup", new Strategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
    },
        (req, username, password, cb) => {
            console.log("hello ", username);
            db.User.findOne({ where: {handle: username} }).then((user) => {
                if (user) {return cb(null, false)}
                else {
                    console.log(req.body);
                    let newUser = req.body;
            
                    db.User.create({ handle: newUser.username, email: newUser.email, password: newUser.password }).then(user => {
                        db.Profile.create({ firstName: newUser.firstName, lastName: newUser.lastName, UserId: user.dataValues.id }).then(profile => {
                            console.log("hello from inside");
                            // let returnedUser = {
                            //     username: req.body.email,
                            //     password: req.body.password
                            // }
                            return cb(null, user);
                        });
                    });
                }
                
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


    function ensureAuthenticated (req, res, next) {
        if (req.isAuthenticated()) { 
            return next();
        }
        res.redirect('/');
    }


    app.get("/login", (req, res) => {
        db.User.findAll({}).then(resultData => {
            res.json(resultData);
        });
    });

    // function loginShenan(req, res, next) {
        // still try to pass data into req.body for next?
    // }

    // app.use("/newUser", loginShenan);

    app.post("/newUser", passport.authenticate("local-signup", {successRedirect: "/survey", failureMessage: "User already exists."}), (req, res) => {
       console.log("sign-up/in success");
    });

    app.post("/login", passport.authenticate("local-signin", {successRedirect: "/profile", failureRedirect: "/"}), (req, res) => {
        console.log("success");
    });

    app.get("/profile", ensureAuthenticated, (req, res) => {
        res.render("profile", req.user.dataValues);
    });

    // app.post("/survey", ensureAuthenticated, (req, res) => {
    //     console.log(req.body);
    //     res.end();
    // });

    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    })

}