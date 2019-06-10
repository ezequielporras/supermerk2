var newRelic = require('newrelic');
var express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

var urlBD = 'mongodb://admin:monster1@ds211029.mlab.com:11029/monsterdb';
// var urlBD = 'mongodb://dev:dev@localhost:27017/dev';
var opts = {useNewUrlParser: true, connectTimeoutMS: 20000};
var mongoose = require('mongoose');
mongoose.connect(urlBD, opts).then
(
    () => {
        console.log("Conectado!!");
    },
    err => {
        newRelic.noticeError(err);
        console.log("ERROR:" + err);
    }
);

var apiRoutes = require("./api-routes");

// Todo lo que recibe la app se tratara como json
app.use(bodyParser.urlencoded(
    {
        extended: true
    }));
app.use(bodyParser.json());
app.use(cors());

// Setup server port
var port = process.env.PORT || 8080;

// Send message for default URL
app.get('/', (req, res) => res.send('App is running'));

// Use Api routes in the App
app.use('/apiMonster', apiRoutes);

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});

