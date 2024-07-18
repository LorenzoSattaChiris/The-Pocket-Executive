const express = require("express");
const router = express.Router();

router
  .get('/', function(req, res){
    res.render("home");
  })
  .get('/signup', function(req,res){
    res.render("signup"); 
  })
  .get('/donaime-creator', function(req,res){
    res.render("modules/donaime-creator"); 
  })
  .get('/idea-validator', function(req,res){
    res.render("modules/idea-validator"); 
  })
  .get('/slogan-creator', function(req,res){
    res.render("modules/slogan-creator"); 
  })

module.exports = router;