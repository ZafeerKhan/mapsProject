const express = require('express');

const app = express();

//app.use(express.static('public'));

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
 
var cloud = true;
 
var mongodbHost = '127.0.0.1';
var mongodbPort = '27017';
 
var authenticate ='';
//cloud
if (cloud) {
 mongodbHost = 'ds261486.mlab.com';
 mongodbPort = '61486';
 authenticate = 'zafeer:zafeer123@'
}
 
var mongodbDatabase = 'hydrodata';
 
// connect string for mongodb server running locally, connecting to a database called test
var url = 'mongodb://'+authenticate+mongodbHost+':'+mongodbPort + '/' + mongodbDatabase;


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.get('/cost', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server.");
         db.collection('cost2018').find({}).toArray(function(err, results){
             //console.log(results.find(site => site.eng === 'A0142'));
             db.close();
             console.log("Connection to database is closed.");
             res.send(results)
         });
     }) 
});

app.get('/hydro', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server.");
     
         db.collection('directhydro2018').find({}).toArray(function(err, results){
             //console.log(results.find(site => site.eng === 'A0142'));
             db.close();
             console.log("Connection to database is closed.");
             res.send(results)
         }); 
     }) 
	
});

app.get('/siteLocations', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server.");
     
         db.collection('ranDBSites').find({}).toArray(function(err, results){
             //console.log(results.find(site => site.eng === 'A0142'));
             db.close();
             console.log("Connection to database is closed.");
             res.send(results)
         }); 
     }) 
	
});

app.listen(3000, () => console.log('server started'));