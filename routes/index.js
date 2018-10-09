var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var Disease = require('../models/disease');
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
      'proxy':'http://172.16.1.11:3128',
      method: 'GET',
  };

  request(options, function(err, res, body){
    if(err)
      throw err;
    else{
      // // TODO: Solve the case when the web scraper could not find what you wanted to .....
      let $ = cheerio.load(body);
      let name = diagnosis;
      let parentName = $('.searchresults.spotlight').find('#spotlight h3').text();
      let info = $('.searchresults.spotlight').find('#spotlight p').text();
      let logo = $('.searchresults.spotlight').find('#spotlight img').attr('src');

      let medication = Array();
      $('.searchresults.medication').find('ul').find('li').each(function(index){
        if(index >10)
          return false;
        let mInfo = $(this).find('a p').text();
        let mUrl = $(this).find('a').attr('href');
        let mName = $(this).find('a').text();
        mName = mName.slice(0, mName.indexOf('Source'));
        let med = Object({
          title : mName,
          url : mUrl,
          info : mInfo
        })
        medication.push(med);
      });

      let procedure = Array();
      $('.searchresults.proc').find('ul').find('li').each(function(index){
        if(index >10)
          return false;
        let pInfo = $(this).find('a p').text();
        let pUrl = $(this).find('a').attr('href');
        let pName = $(this).find('a').text();
        pName = pName.slice(0, pName.indexOf('Source'));
        let proc = Object({
          title : pName,
          url : pUrl,
          info : pInfo
        })
        procedure.push(proc);
      });

      var diseaseInfo = new Disease({
        parentName : parentName,
        name: name,
        info: info,
        logo: logo,
        medication: medication,
        procedure: procedure
      });
      Disease.addDiseaseInfo(diseaseInfo, function(error, response){
        return true;
      });
    }
  })
}

function fetchAndStoreDiagnosisDetails(diagnosis){
  Disease.searchByName(diagnosis, function(err, res){
    if(err)
      throw err;
    else{
      if(res.length == 0){
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
          for(var each in diagnosisList){
            fetchAndStoreDiagnosisDetails(diagnosisList[each].Issue.ProfName);
          }
          res.render('result' , {
              diagnosisList : diagnosisList,
              query : req.query.sQuery
          });
        }
    });
  }
});

router.get('/getDiseaseInfo/:disease', function(req, res, next){
  let disease = req.params.disease.trim();
  console.log(disease);
  Disease.searchByName(disease, function(err, diseaseInfo){
    if(err)
      throw err;
    else {
      console.log(diseaseInfo[0]);
      res.status(200).send({
        diseaseInfo : diseaseInfo
      })
    }
  });
})
module.exports = router;
