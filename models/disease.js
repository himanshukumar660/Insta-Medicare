var mongoose = require("mongoose");

const uri = "mongodb+srv://himanshu:Himanshu103@cluster0-drmqc.mongodb.net/test?retryWrites=true"
mongoose.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
   const collection = client.db("test").collection("disease");
   // perform actions on the collection object
   client.close();
});

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
