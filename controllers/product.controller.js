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
			html = html + '<option selected value="'+item.publisherID+'">'+ item.publisher + '</option>';
		}
		else{
			html = html + '<option value="'+item.publisherID+'">'+item.publisher+'</option>';
		} });
		return new handlebars.SafeString(html);
});

handlebars.registerHelper("catagory_mulselect",(catagories,catagories_list)=>{
	let html="";
			catagories_list.forEach((item)=> { 
				let check=false;
				catagories.forEach((catagory)=>{
				if(catagory == item.categoriesID){
					check=true;
				}	
			});
			if(check)
			{
				html = html + '<label for="one"><input class="catagoriCheckbox" type="checkbox" checked onclick="changeStatus()" id="'+ item.categoriesID 
				+ '" value="'+ item.categoriesID+ '-' +item.categories +'">'+item.categories+'</label>';
			}
			else{
				html = html + '<label for="one"><input class="catagoriCheckbox" type="checkbox" onclick="changeStatus()" id="' + item.categoriesID 
					+ '" value="'+ item.categoriesID+ '-' +item.categories +'">'+item.categories+'</label>';
			}
			});
		return new handlebars.SafeString(html);	
})

handlebars.registerHelper("showcatagories",(catagoryID,catagories_list)=>{
	let html="";
	let categoriesID="";
	let count=0;
	catagories_list.forEach((item)=> { 
		catagoryID.forEach((catagory)=>{
		if(catagory == item.categoriesID){
			if(count>0)
			{
				html = html + ", ";
				categoriesID=categoriesID+",";
			}
		html = html +item.categories;
		categoriesID=categoriesID+item.categoriesID;
		count++;
		}	
	});
	});
	let result= '<option id="catagories" value="'+ categoriesID +'">'+html+'</option>'
return new handlebars.SafeString(result);	
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
