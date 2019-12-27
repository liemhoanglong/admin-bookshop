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
	img: [String]
}, { collection: 'products' });

//4.tạo model
var products = mongoose.model('products', productsSchema);
//module.exports = products;

module.exports.getAllProduct = function() {
	return products.find().sort('title');
}

module.exports.getProductByID = (id) =>{
	return products.findById(id);
}

module.exports.deleteProductByID = (id) =>{
  // console.log('delete ' + id);
  // return products.findByIdAndRemove(id);
  products.findById(id, function(err, data){
  	data.remove();
  });
}



module.exports.createProduct = (title, price, author, info, categoriesID, publisher) =>{
	return new products ({title, price, author, info, categoriesID, publisher});
}