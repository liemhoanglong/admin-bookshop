require('dotenv').config()
//1.require mongoose
var mongoose = require('mongoose');

//2.connect
//if (mongoose.connect('mongodb+srv://linh796:linh796@cluster0-lbsr0.mongodb.net/bookshop?retryWrites=true&w=majority')){
// if (mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true,useUnifiedTopology: true })){
//   console.log('connected to database\n');
// }

//3.tạo Schema
var adminsSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	phone: String,
	address: String,
	img: String,
	type:Number,
	lock: Number
}, {collection: 'admins'});

//4.tạo model
var admins = mongoose.model('admins', adminsSchema);
module.exports = admins;