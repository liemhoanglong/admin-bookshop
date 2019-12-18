const products =require('../model/products.model');
const categories =require('../model/categories.model');
const publishers =require('../model/publishers.model');
const admins = require('../model/admins.model');

const passport = require('passport');
const bcrypt = require('bcryptjs');
const handlebars= require('hbs');

handlebars.registerHelper("publisher_select",(selectedpublisherID,publisher_list)=>{
	let html = "";
	publisher_list.forEach(function(item) { 
		if(item.publisherID == selectedpublisherID)
		{
			html = html + '<option selected>'+ item.publisher + '</option>';
		}
		else{
			html = html + '<option>'+item.publisher+'</option>';
		} });
		return new handlebars.SafeString(html);
});

handlebars.registerHelper("catagory_mulselect",(catagories,catagories_list)=>{
	let html="";
	//console.log(catagories_list);
			catagories_list.forEach((item)=> { 
				let check=false;
				catagories.forEach((catagory)=>{
					  console.log(item.categoriesID);
					  console.log(catagory);
					  console.log('a');
				if(catagory == item.catagoriesID){
					check=true;
					console.log("check true");
				}	
			});
			//console.log(check);
			if(check)
			{
				html = html + '<label for="one"><input class="catagoriCheckbox" type="checkbox" checked onclick="changeStatus()" id="'+ item.categoriesID 
				+ '" value="' +item.categories + '">'+item.categories+'</label>';
			}
			else{
				html = html + '<label for="one"><input class="catagoriCheckbox" type="checkbox" onclick="changeStatus()" id="' + item.categoriesID 
					+ '" value="'+item.categories+'">'+item.categories+'</label>';
			}
			});
		return new handlebars.SafeString(html);	
})

module.exports.showProduct = (req, res, next) => {
	//if (req.user.type === 3) {		
		categories.find().sort('categories')
		.then(function (category) {
			publishers.find().sort('publisher')
			.then(function (publisher) {
				products.find().sort('title')
				.then(function (product) {
					res.render('products', {categories: category, publish: publisher, items: product, title : 'Danh sách sản phẩm'});
				});
			});        
		});
	// } else {
	// 	req.flash('error_msg', 'Bạn không được phép truy cập vào đây!');
	// 		res.redirect('/account');
	// }
}

module.exports.addProduct = (req, res, next) => {
	res.render('add-product', {title : 'Thêm sản phẩm mới'});
}

module.exports.editProduct = async (req, res, next) => {
	if(req.query.id){

	try {
	const[dataProduct,publisher,category]= 
	await Promise.all([products.findById(req.query.id),
		publishers.find().sort('publisher'),
		categories.find().sort('categories')
	]);
	// console.log(category);
	res.render('edit-product', {title : 'Chỉnh sửa sản phẩm', item: dataProduct, publisher: publisher, category: category});
	
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
	}	else{
		console.log("Can't show item\n");
		res.sendStatus(500);
	}
};
