const express = require("express");
const router = express.Router();

router
  .get('/', function(req, res){
    res.render("landing");
  })
  .get('/home', function(req, res){
    res.render("home");
  })
  .get('/signup', function(req,res){
    res.render("signup"); 
  });

module.exports = router;