var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';

function validUrl(url) {
  var reg = /^(https?|ftp):\/\/[a-z0-9-]+(\.[a-z0-9-]+)+([\/?].+)?([\/d+])?$/;
  console.log('in here');
  return reg.test(url);
}

function checkID(url) {
  var ind = url.lastIndexOf("/");
  var currInd = url.slice(ind+1,url.length);

  return (Number(currInd)) ? currInd : null ;
}

app.get('/https://*',function(req,res) {
 
  var orig = req.hostname+"/";
  var urlReq = 'https://'+req.params[0];
  
  var reg = /^(https?|ftp):\/\/[a-z0-9-]+(\.[a-z0-9-]+)+([\/?].+)?([\/d+])?$/;
  if (validUrl(urlReq)) {
    //now add the check for index
    var id;
    id = checkID(urlReq)  //this checks if the current index is a number, if it is, this means url exists in d.b, d.b must be queryed w/ ind
    if (id !== null) {
    
    } else { 
    //url does not exist in d.b, so insert url into d.b with _id 

    }
  } //end of url being valid condition
res.send('wowee');

});





app.listen(3030);
