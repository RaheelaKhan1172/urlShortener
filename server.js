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

function getNextSequence(db) {
  db.update({$set:{count:1}},function(err,res) {
    if (err) throw err;
    console.log('ures',res);
    return res;
  }); 
}

function insertData(urlReq) {
  console.log('wawa');
  MongoClient.connect(url,function(err,db) {
    var currI;
    var collection = db.collection('url3');
    var counter = db.collection('counter');
    counter.update( 
      {"name":"counter"},
      {
        $inc:{"count":1}
      }, function(err,result) {
      console.log('well',result);
      return result;
    });

    counter.find({"name":"counter"}).toArray(function(err,result) {
      if (err) throw (err);
      currI = result[0].count;
      console.log(result,'infind',result[0].count);
      
      collection.insert( {
        url: urlReq,
        _id: currI 
      }, function(err,result) {
        if (err) throw err;
        console.log('inserteddata',result);
    }); 
    });
  }); 


} 

app.get('/*',function(req,res) {
  var urlReq = req.params[0];
  console.log(urlReq,req.params[0]);
  var response;
  if (validUrl(urlReq)) {
    //now add the check for index
    var id;
    id = checkID(urlReq)  //this checks if the current index is a number, if it is, this means url exists in d.b, d.b must be queryed w/ ind
    if (id !== null) {
            
    } else { 
    //url does not exist in d.b, so insert url into d.b with _id 
      response = insertData(urlReq);
    }
  } //end of url being valid condition
res.send('ok');
});



app.listen(3030);
