const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const admins =require('../model/admins.model');
const products =require('../model/products.model');
const categories =require('../model/categories.model');
const publishers =require('../model/publishers.model');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const controllerProduct =require('../controllers/product.controller');

/* GET products page. */
//router.get('/products', ensureAuthenticated, controllerProduct.showProduct);
router.get('/products', controllerProduct.showProduct);

/* GET add-product page. */
router.get('/add-product', controllerProduct.addProduct);

/* GET edit-product page. */
router.get('/edit-product', controllerProduct.editProduct);


/* POST insert-category page. */
router.post('/insert-category', (req, res, next) => {
const temp = {
		categoriesID: req.body.code,
		categories: req.body.name
	}
	let data = new categories(temp);
	console.log(data);
	data.save();
	res.redirect('/products');
});

/* POST insert-publisher page. */
router.post('/insert-publisher', (req, res, next) => {
	const temp = {
		publisherID: req.body.code,
		publisher: req.body.name
	}
	let data = new publishers(temp);
	console.log(data);
	data.save();
	res.redirect('/products');
});

/* POST edit-product page. */
router.post('/edit-product',  (req, res, next) => {
	products.findById(req.query.id)
	.then (data => {
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
	})
	res.redirect('/products');
});


// /* POST edit-publisher page. */
// router.post('/edit-publisher', (req, res, next) => {
// 	//console.log(req.query.id);
// 	publishers.findById(req.query.id)
// 	.then (data => {
// 		data.publisherID = req.body.code;
// 		data.publisher = req.body.name;
// 		data.save();
// 	})
// 	res.redirect('/products');
// });

/* GET category delete page. */
router.get('/category-delete', function (req, res, next) {
	categories.findByIdAndRemove(req.query.id, (err) => {
		res.redirect('/products');
	});
});

/* GET publisher delete page. */
router.get('/publisher-delete', function (req, res, next) {
	publishers.findByIdAndRemove(req.query.id, (err) => {
		res.redirect('/products');
	});
});

/* GET product delete page. */
router.get('/product-delete', function (req, res, next) {
	products.findByIdAndRemove(req.query.id, (err) => {
		res.redirect('/products');
	});
});

module.exports = router;
