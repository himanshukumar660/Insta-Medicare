var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/disease");

var db = mongoose.connection;

var Schema = mongoose.Schema;

var symptoms = new Schema({
	Name : {
		type : String
	},
	ID : {
		type : Number
	}
});

var Symptom = module.exports = mongoose.model("Symptom", symptoms);

module.exports.addSymptom = function(symptom, callback){
		symptom.save(callback);
}

module.exports.searchByName = function(pattern, callback){
	pattern = new RegExp(pattern, 'i');
	Symptom.find({
		$or : [
			{
				Name : pattern
			}
		]
	}).exec(callback);
}

module.exports.countDocs = function(callback){
	Symptom.count().exec(callback);
}
