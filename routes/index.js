var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var Article = require('../models/article');
var http = require("http");
var https = require("https");
var async = require("async");
var router = express.Router();
var keyword_extractor = require("keyword-extractor");

function getToken(callback){
  var headers = {
    'Authorization' : 'Bearer himanshukmar660@gmail.com:Mv6K7H7Jqwjw8v5oVZ9gag=='
  }
  var options = {
      url: 'https://sandbox-authservice.priaid.ch/login',
      'proxy':'http://172.16.1.11:3128',
      method: 'POST',
      headers: headers,
  }
  request(options, function (error, response, body) {
      if (!error) {
          body = JSON.parse(body);
          let token = body.Token;
          //console.log(body,token);
          return callback(null, token);
      }
      else {
        return callback(error);
      }
  })
};

function fetchSymptoms(token, callback){
  var options = {
    url: 'https://sandbox-healthservice.priaid.ch/symptoms',
    qs : {
      'token' : token,
      'language' : 'en-gb'
    },
    'proxy':'http://172.16.1.11:3128',
    method: 'GET',
  }
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      return callback(null, body);
    }
    else{
      return callback(error);
    }
  })
};

function getSymptomList(callback){
  getToken(function(err, token){
    if(err)
      throw callback(err);
    else{
      fetchSymptoms(token, function(err1, symptoms){
        if(err1)
          throw callback(err1);
        else {
          return callback(null, symptoms);
        }
      })
    }
  });
};

function fetchDiagnosis(token, sex, symptomList, dob, callback){
  console.log(symptomList);
  var options = {
    url: 'https://sandbox-healthservice.priaid.ch/diagnosis',
    qs : {
      'token' : token,
      'symptoms' : JSON.stringify(symptomList),
      'gender' : sex,
      'year_of_birth' : dob,
      'language' : 'en-gb'
    },
    'proxy':'http://172.16.1.11:3128',
    method: 'GET',
  }
  request(options, function (error, response, body) {
    console.log(body);
    if (!error && response.statusCode == 200) {
      return callback(null, body);
    }
    else{
      return callback(error);
    }
  })
}

function getDiagnosisList(sex, symptomList, dob, callback){
  getToken(function(err, token){
    if(err)
      throw callback(err);
    else{
      fetchDiagnosis(token, sex, symptomList, dob, function(err1, diagnosisList){
        if(err1)
          throw callback(err1);
        else {
          return callback(null, diagnosisList);
        }
      })
    }
  });
}

function saveDiagnosisDetails(diagnosis, callback){
  var options = {
      uri: "https://www.medicinenet.com/search/mni/"+diagnosis,
      transform: function (body) {
          return cheerio.load(body);
      }
  };

  rp(options)
    .then(function($){
      let title = $('h1.title').text();
      let dateStr = $('.blue-color.ksl-time-stamp none').text().split('\n')[1];
      let details = "";
      $('div[id^="content-body-"] p').each(function(){
        details += $(this).text();
      });
      var articleDoc = new Article({
        title : title,
        date : dateStr,
        details : details
      });
      Article.addArticle(articleDoc, function(error, response){
        return callback(null);
      });
    })
    .catch(function (err){
      return callback(err);
    });
}

function fetchAndStoreDiagnosisDetails(diagnosis){
    CheckDBAndStore(diagnosis, function(err, res){
      if(err)
        throw err;
      else{
        if(!res){
          //Not existent, make a WEB Scraping and the store the JSON to the debug
          saveDiagnosisDetails(diagnosis);
        }
      }
    });
};

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express'});
});

router.get('/getSymptomList', function(req, res, next){
  getSymptomList(function(err1, symptomList){
    if(err1)
      throw err1;
    else {
      symptomList = JSON.parse(symptomList);
      res.status(200).send({instances : symptomList, statusCode : 200});
    }
  });
});

router.get('/getDiagnosis/', function(req, res, next){
  let queryDesc = "", sex = "none", processedSymptoms = [], symptomList = [];
  let dob = 1997; //Make this as an input for the user

  if(req.query.sQuery){
    queryDesc = req.query.sQuery;
    processedSymptoms = keyword_extractor.extract(queryDesc, {
      language : "english",
      remove_digits: true,
      return_changed_case:true,
      remove_duplicates: false
    });
  }

  if(req.query.sex)
    sex = req.query.sex;

  if(typeof req.query.mines == 'string'){
    symptomList.push(req.query.mines);
  }
  else {
    for(var i=0;i<req.query.mines.length;i++){
      symptomList.push(req.query.mines[i]);
    }
  }
  // Find a way to tranlate the synmptoms to its associated ID for accessing its diagnosis from APIMEDIC
  //symptomList = symptomList.concat(processedSymptoms);
  if(symptomList.length == 0){
    //pass an alert to the user to select at least one symptom or write his problem in his own words
    res.redirect('/');
  }
  else{
    //Fetch all the diagnosis and return them to the user
    getDiagnosisList(sex, symptomList, dob, function(err, diagnosisList){
        if(err){
          throw err;
        }
        else{
          diagnosisList = JSON.parse(diagnosisList);
          //fetchAndStoreDiagnosisDetails(diagnosisList);
          res.render('result' , {
              diagnosisList : diagnosisList,
              query : req.query.sQuery
          });
        }
    });
  }
});

module.exports = router;
