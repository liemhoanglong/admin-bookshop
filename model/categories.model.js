require('dotenv').config()
//1.require mongoose
var mongoose = require('mongoose');

//2.connect
//if (mongoose.connect('mongodb+srv://linh796:linh796@cluster0-lbsr0.mongodb.net/bookshop?retryWrites=true&w=majority')){
// if (mongoose.connect(process.env.DB_HOST,{useNewUrlParser:true,useUnifiedTopology: true })){
// 	console.log('connected to database\n');
// }

//3.tạo Schema
var categoriesSchema = new mongoose.Schema({
  categoriesID: String,
  categories: String
}, { collection: 'categories' });

//4.tạo model
var categories = mongoose.model('categories', categoriesSchema);
module.exports = categories;

module.exports.getAllCategories = function() {
  return categories.find().sort('categories');
}

module.exports.checkCategories = (temp) => {
  return categories.findOne({categoriesID: temp});
}

module.exports.getCategoryByID = (id) => {
  return categories.findById(id);
}

module.exports.deleteCategoryByID = (id) =>{
  // console.log('delete ' + id);
  // return products.findByIdAndRemove(id);
  categories.findById(id).remove().exec();
  // , function(err, data){
  // 	data.remove();
  // });
}
