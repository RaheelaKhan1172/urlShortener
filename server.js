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
  console.log(ind,url,'checkurl',currInd);
  return (Number(currInd)) ? Number(currInd) : null ;
}
function retrieveUrl(id,res) {
  console.log('did i ever happen');
  MongoClient.connect(url,function(err,db) {
    var collection = db.collection('url3');
    collection.find({_id:id}).toArray( function(err,response) {
      console.log('well,how about me?',response);
      var toRedirect = response[0].url;
      db.close(); 
      return res.redirect(toRedirect);
    });
  });
}

/*function getNextSequence(db) {
  db.update({$set:{count:1}},function(err,res) {
    if (err) throw err;
    console.log('ures',res);
    return res;
  }); 
}*/

function insertData(urlReq,res,original) {
  console.log('wawa',res);
  MongoClient.connect(url,function(err,db) {
    var str = [];
    var currI;
    var jsonStr = "";
    var collection = db.collection('url3');
    var counter = db.collection('counter');
      
    counter.update( 
      {"name":"counter"},
      {
        $inc:{"count":1}
      }, function(err,result) {
      console.log('well',result);
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
        console.log('inserteddata',result,'ops',result.ops[0].url,result.ops[0]._id);
        str.push(result.ops[0].url)
        str.push(result.ops[0]._id)
        db.close();
        jsonStr += '{"url":"'+ str.shift() +'","short_url":"'+ original+'/'+str.pop() + '"}';
        return res.send(JSON.parse(jsonStr));
      }); 
    });
  });
} 

app.get('/*',function(req,res) {
  var urlReq = req.params[0];
  var original = req.hostname;
  console.log(urlReq,req.params[0],req.hostname,'host');
  var response;
 // if (validUrl(urlReq)) {
    //now add the check for index
    var id;
    id = checkID(urlReq)  //this checks if the current index is a number, if it is, this means url exists in d.b, d.b must be queryed w/ ind
    if (id !== null) {
      retrieveUrl(id,res);        
    } else { 
    //url does not exist in d.b, so insert url into d.b with _id 
      insertData(urlReq,res,original);
    }
 // } //end of url being valid condition
});


app.listen(3030);
