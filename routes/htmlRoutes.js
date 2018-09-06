const router = require('express').Router();

const db = require("../models");
const path = require("path");

  // Load index page
  router.get("/", function(req, res) {
    console.log('new page')
    //res.sendFile(path.join(__dirname, "../index.html"));
    res.render('index');
  });

  router.get("/survey", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/survey.html"));
  })

module.exports = router;