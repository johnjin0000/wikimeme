const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');


//Init App
const app = express();
const http = require("http").Server(app);

mongoose.connect(config.database,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
});

mongoose.Promise = Promise;
let db = mongoose.connection;

//Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

//Check for DB errors
db.on('error', function(err){
  console.log(err);
});

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session Middlware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Home route
app.get('/', function(req, res){
      res.render('index');
});

//About page
app.get('/about', function(req, res){
      res.render('about');
});


//Route files
let memes = require('./routes/memes');
//let sets = require('./routes/sets');
app.use('/memes', memes);
//app.use('/sets', sets);*/


//Start Server
const server =  http.listen(4000, function(){
  console.log('Server started on port 4000...');
});
