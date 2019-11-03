const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
var fs = require('fs');
var multer = require('multer');

//Bring in Models
let Meme = require('../models/meme');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/images/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });
//multer middleware
//router.use(multer({dest:'./public/images/'}).single('img'));

//Get add meme page
router.get('/add', function(req, res){
  res.render('new_meme');
});

//receive info from add meme page
router.post('/add', upload.single('img'), function(req,res,next){
req.checkBody('name','Name of meme is required').notEmpty();
req.checkBody('description','Description of meme is empty').notEmpty();

//Get Errors
let errors = req.validationErrors();

if(errors){
  res.render('new_meme', {
    errors:errors
  });
} else {
    let meme = new Meme();
    meme.name = req.body.name;
    meme.description = req.body.description;
    meme.year = req.body.year;
    const link = req.body.youtube;
    meme.youtube = link.replace(/watch\?v=/g, 'embed/');
    meme.img = req.file.filename;
    meme.save(function(err){
      if(err){
        console.log(err);
        return;
      }
      else {
        req.flash('success','Meme Added');
        res.redirect('/');
      }
    });
  }
});

//memes by year
router.post('/search', function(req, res){
  Meme.find({name: { $regex: req.body.search,  $options: 'i' }}, function(err, memes){
    if(err){
      console.log(err);
    }
    else{
      res.render('all_memes', {
        header: "Memes containing",
        filter: req.body.search,
        memes:memes
      });
    }
  });
});

//memes by year
router.get('/year/:id', function(req, res){
  Meme.find({year: req.params.id}, function(err, memes){
    if(err){
      console.log(err);
    }
    else{
      res.render('all_memes', {
        header: "Memes in the year",
        filter: req.params.id,
        memes:memes
      });
    }
  });
});

//memes by alphabet
router.get('/alphabet/:id', function(req, res){
  const regex = '^' + req.params.id;
  Meme.find({name: { $regex: regex,  $options: 'i' }}, function(err, memes){
    if(err){
      console.log(err);
    }
    else{
      res.render('all_memes', {
        header: "Memes starting with",
        filter: req.params.id,
        memes:memes
      });
    }
  });
});

//Get Single Meme
router.get('/:id', function(req,res){
  Meme.findById(req.params.id, function(err, meme){
        res.render('meme', {
          meme:meme
        });
    });
});




module.exports = router;
