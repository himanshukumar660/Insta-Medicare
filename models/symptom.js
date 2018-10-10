var mongoose = require("mongoose");

const uri = "mongodb+srv://himanshu:Himanshu103@cluster0-drmqc.mongodb.net/test?retryWrites=true"
mongoose.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   const collection = client.db("test").collection("disease");
   client.close();
});

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
	pattern = new RegExp('.*'+pattern+'.*', 'si');
	Symptom.find({
		$or : [
			{
				Name : pattern
			}
		]
	}).exec(callback);
}


module.exports.searchByList = function(patternList, callback){
	if(patternList.length == 0)
		return callback(null);
	regexArray = '.*' + patternList.join('|') + '.*';

	Symptom.find({
		"Name" : {
			$regex : regexArray,
			$options : "si"
		}
	}).exec(callback);
}


module.exports.countDocs = function(callback){
	Symptom.count().exec(callback);
}
