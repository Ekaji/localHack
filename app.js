const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const hbs = require('handlebars');
const bodyParser = require('body-parser');
const routes = require('./routes/index')

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/api', routes)

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

const server = app.listen(3000, function() {
    console.log('MLH app running port 3000');
});