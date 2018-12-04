const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const hbs = require('handlebars');
const bodyParser = require('body-parser');
const routes = require('./routes/index')
const expressValidator = require('express-validator');
const errorHandlers = require("./lib/handleError");

const app = express();


// import environmental variables from our variables.env file
require("dotenv").config({ path: "./keys.env" });


// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
    console.error(`${err.message}`);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));

// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
app.use(expressValidator());


//handling CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if(req.method === 'OPTIONS'){
    res.header("Access-Control-Allow-Methods","POST, PUT, GET, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.render('index', {
        title: 'Home'
    });
})

app.get('/user', function(req, res) {
    res.render('user', {
        title: 'User Section'
    });
});

app.use('/api', routes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);


// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

app.set('PORT', process.env.PORT);

const server = app.listen(app.get('PORT'), function() {
    console.log(`MLH app running port ${app.get('PORT')}`);
});