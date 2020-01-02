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

/* POST insert-product page. */
router.post('/insert-product', controllerProduct.insertProduct);

/* GET edit-product page. */
router.get('/edit-product', controllerProduct.editProduct);

/* GET product delete */
router.get('/product-delete', controllerProduct.deleteProduct);



/* POST insert-category page. */
router.post('/insert-category', controllerProduct.insertCategory);

/* POST insert-publisher page. */
router.post('/insert-publisher', controllerProduct.insertPublisher);


/* POST edit-product page. */
router.post('/edit-product', controllerProduct.updateProduct);


/* POST edit-category page. */
router.post('/edit-category', controllerProduct.editCategory);

/* POST edit-publisher page. */
router.post('/edit-publisher', controllerProduct.editPublisher);


/* GET category delete page. */
router.get('/category-delete', controllerProduct.deleteCategory);

/* GET publisher delete page. */
router.get('/publisher-delete', controllerProduct.deletePublisher);


module.exports = router;
