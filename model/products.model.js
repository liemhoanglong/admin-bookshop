require('dotenv').config()
//1.require mongoose
var mongoose = require('mongoose');

//2.connect
//if (mongoose.connect('mongodb+srv://linh796:linh796@cluster0-lbsr0.mongodb.net/bookshop?retryWrites=true&w=majority')){
// if (mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true,useUnifiedTopology: true })){
// 	console.log('connected to database\n');
// }

//3.tạo Schema
var productsSchema = new mongoose.Schema({
	title: String,
	price: Number,
	author: String,
	categoriesID: [String],
	publisherID: String,
	info: String,
	img: [String],
	imgDir: [String],
	count: Number,
	countView: Number,
}, { collection: 'products' });

//4.tạo model
var products = mongoose.model('products', productsSchema);
//module.exports = products;

module.exports.getAllProduct = function() {
	return products.find().sort('title');
}

module.exports.top = function() {
	return products.find().sort([['count', -1]]);
}

module.exports.getProductByID = (id) =>{
	return products.findById(id);
}

module.exports.deleteProductByID = (id) =>{
  // console.log('delete ' + id);
  // return products.findByIdAndRemove(id);
  products.findById(id).remove().exec();
  // , function(err, data){
  // 	data.remove();
  // });
}



module.exports.createProduct = (title, price, author, info, publisherID, categoriesID, count, countView) =>{
	return new products ({title, price, author, info, publisherID, categoriesID, count, countView});
}