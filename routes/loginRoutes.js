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
            console.log("hello ", username);
            db.User.findOne({ where: {email: username} }).then((user) => {
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


    function ensureAuthenticated (req, res, next) {
        if (req.isAuthenticated()) { 
            return next();
        }
        res.redirect('/');
    }


    app.get("/login", (req, res) => {
        db.User.findAll({}).then(resultData => {
            console.log(resultData);
            res.json(resultData);
        });
    });

    app.post("/newUser", (req, res) => {
        console.log(req.body);
        let newUser = req.body;
        // add to database, redirect and authenticate, redirect to survey
        db.User.create({ handle: newUser.username, email: newUser.email, password: newUser.password }).then(user => {
            console.log("user: " + user.dataValues);
            db.Profile.create({ firstName: newUser.firstName, lastName: newUser.lastName, UserId: user.dataValues.id }).then(profile => {
                console.log(profile.dataValues);
                res.redirect("/survey");
            });
        });
    });

    app.post("/login", passport.authenticate("local", {successRedirect: "/profile", failureRedirect: "/"}), (req, res) => {
        console.log("success", req.body);
    });

    app.get("/profile", ensureAuthenticated, (req, res) => {
        console.log(req.user.dataValues);
        res.render("profile", req.user.dataValues);
    });

    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    })

}