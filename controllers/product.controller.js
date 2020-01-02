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
	const limit = 6;
	let page;
	if (req.query.page) {
		page = req.query.page;
	} else {
		page = 1;
	}
	//console.log(page);
	let startIndex = (page - 1) * limit;  
	let endIndex = page * limit;
	//if (req.user.type === 3) {		
		
		// const[category, publisher, product] = 
		// await Promise.all([
		// 	categories.getAllCategories(),
		// 	publishers.getAllPublisher(),
		// 	products.getAllProduct()
		// 	]);
		// res.render('products', {categories: category, publish: publisher, items: product, title : 'Danh sách sản phẩm'});
		
		categories.getAllCategories()
		//categories.find().sort('categories')
		.then(function (category) {
			//publishers.find().sort('publisher')
			publishers.getAllPublisher()
			.then(function (publisher) {
				//products.find().sort('title')
				products.getAllProduct()
				.then(function (product) {
					let numberOfUser = product.length;
					product = product.slice(startIndex, endIndex);
					res.render('products', {
						categories: category, 
						publish: publisher, 
						items: product, 
						title : 'Danh sách sản phẩm',
						numberOfUser,				
						page
					});
				});
			});        
		});

	// } else {
	// 	req.flash('error_msg', 'Bạn không được phép truy cập vào đây!');
	// 		res.redirect('/account');
	// }
}

module.exports.addProduct = async (req, res, next) => {
	const[publisher,category]= 
	await Promise.all([
		publishers.getAllPublisher(),
		categories.getAllCategories()
		]);
	res.render('add-product', {title : 'Thêm sản phẩm mới', publisher: publisher, category: category});
}

module.exports.editProduct = async (req, res, next) => {
	if(req.query.id){

		try {
			const[dataProduct,publisher,category]= 
			await Promise.all([
				products.getProductByID(req.query.id),
				publishers.getAllPublisher(),
				categories.getAllCategories()
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

module.exports.deleteProduct = (req, res, next) => {
	if(req.query.id){
		try {
			products.deleteProductByID(req.query.id);
			res.redirect('/products');
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		}
	}else{
		console.log("Can't show item\n");
		res.sendStatus(500);
	}
}

module.exports.insertProduct = (req, res, next) => {
	let category = req.body.categories;
	// convert req.body.categories to array
	let arraycategory = category.split(',');
	const temp = {
		title: req.body.name,
		price: req.body.price,
		author: req.body.author,
		info: req.body.info,
		categoriesID: arraycategory,
		publisher: req.body.publisher
	}
	let data = products.createProduct(temp.title, temp.price, temp.author, temp.info, temp.categoriesID, temp.publisher);
	console.log(data);
	data.save();
	res.redirect('/products');
}

module.exports.updateProduct = async(req, res, next) => {
	if(req.query.id){
		try {const data = await products.getProductByID(req.query.id);
			//console.log(data);
			//console.log(req.body);
			data.title = req.body.name;
			data.price = req.body.price;
			data.author = req.body.author;
			let category= req.body.categories;
			// convert req.body.categories to array
			let arraycategory= category.split(',');
			data.categoriesID = arraycategory;
			data.publisherID = req.body.publisher;
			data.info = req.body.info;
			data.save();
			// console.log("data after edit")
			// console.log(data);
		} catch (error) {
			console.log(error);
			res.sendStatus(500);
		}
	}else{
		console.log("Can't show item\n");
		res.sendStatus(500);
	}
	res.redirect('/products');
}

module.exports.insertCategory = (req, res, next) => {
	const temp = {
		categoriesID: req.body.code,
		categories: req.body.name
	}
	//categories.findOne({categoriesID: temp.categoriesID})
	categories.checkCategories(temp.categoriesID)
	.then(check => {
		if (check) {
			console.log('category đã tồn tại');
			return;
		} else {
			let data = new categories(temp);
			console.log(data);
			data.save();
		}
	});
	res.redirect('/products');
}

module.exports.insertPublisher = (req, res, next) => {
	const temp = {
		publisherID: req.body.code,
		publisher: req.body.name
	}
	publishers.checkPublisher(temp.publisherID)
	.then(check => {
		if (check) {
			console.log('publisher đã tồn tại');
		} else {
			let data = new publishers(temp);
			console.log(data);
			data.save();
		}
	})
	res.redirect('/products');
}

module.exports.editCategory = (req, res, next) => {
	//console.log(req.query.id);
	categories.getCategoryByID(req.query.id)
	.then (data => {
		//console.log(req.body.code);
		//console.log(req.body.name);
		//console.log(data);
		data.categoriesID = req.body.code;
		data.categories = req.body.name;
		data.save();
	})
	res.redirect('/products');
}

module.exports.editPublisher = (req, res, next) => {
	//console.log(req.query.id);
	//publishers.findById(req.query.id)
	publishers.getPublisherByID(req.query.id)
	.then (data => {
		data.publisherID = req.body.code;
		data.publisher = req.body.name;
		data.save();
	})
	res.redirect('/products');
}

module.exports.deleteCategory = (req, res, next) => {
	categories.deleteCategoryByID(req.query.id)
		res.redirect('/products');
}

module.exports.deletePublisher = (req, res, next) => {
	publishers.deletePublisherByID(req.query.id)
		res.redirect('/products');
}