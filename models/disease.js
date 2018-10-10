var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/disease");

var db = mongoose.connection;

var Schema = mongoose.Schema;

var diseases = new Schema({
	parentName : {
		type: String
	},
	name: {
		type: String
	},
	logo: {
		type : String
	},
	info: {
		type : String
	},
	medication:[{
		url:{
			type : String
		},
		title:{
			type: String
		},
		info:{
			type : String
		}
	, _id : false}],
	procedure:[{
		url:{
			type : String
		},
		title:{
			type: String
		},
		info:{
			type : String
		}
	, _id : false}],
});

var Disease = module.exports = mongoose.model("Disease", diseases);

module.exports.addDiseaseInfo = function(diseaseDetails, callback){
		//console.log(diseaseDetails);
		diseaseDetails.save(callback);
}

module.exports.searchByName = function(pattern, callback){
	pattern = new RegExp(pattern);
	console.log(pattern);
	Disease.find({
		$or : [
			{
				name : pattern
			}
		]
	}).exec(callback);
}
