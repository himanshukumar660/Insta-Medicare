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

function saveArticle(articleLinks, callback){
    function fetchAndSave(url){
      var options = {
          uri: url,
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
};

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

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express'});
});

router.get('/getDiagnosis/', function(req, res, next){

  let queryDesc = "", sex = "none", processedSymptoms = [], symptomList = [];

  if(req.query.sQuery){
    queryDesc = req.query.sQuery;
    processedSymptom = keyword_extractor.extract(queryDesc, {
      language : "english",
      remove_digits: true,
      return_changed_case:true,
      remove_duplicates: false
    });
  }

  if(req.query.sex)
    sex = req.query.sex;

  if(req.query.mines)
    symptomList = req.query.mines;

  symptomList = symptomList.concat(processedSymptoms);
  //console.log(symptomList, sex);
  if(symptomList.length == 0){
    //pass an alert to the user to select at least one symptom or write his problem in his own words
    res.redirect('/');
  }
  else{
    res.redirect('/');
  }
  // Article.regexSearch(query, function(error, response){
  //   if(error){
  //     res.status(404).send({
  //       message : "Unable to perform search"
  //     });
  //   }
  //   else{
  //     res.status(200).send({
  //       articles : response
  //     });
  //   }
  // });
});

module.exports = router;
