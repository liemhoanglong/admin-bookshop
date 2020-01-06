const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const admins =require('../model/admins.model');
const products =require('../model/products.model');
const categories =require('../model/categories.model');
const publishers =require('../model/publishers.model');
const multer = require('multer');


const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const controllerProduct =require('../controllers/product.controller');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({storage: storage })

/* GET products page. */
router.get('/products', ensureAuthenticated, controllerProduct.showProduct);
//router.get('/products', controllerProduct.showProduct);

/* GET add-product page. */
router.get('/add-product', controllerProduct.addProduct);

/* POST insert-product page. */
router.post('/insert-product', controllerProduct.insertProduct);

/* GET edit-product page. */
router.get('/edit-product', controllerProduct.editProduct);

/* POST edit-product page. */
router.post('/edit-product', controllerProduct.updateProduct);

/* POST upload img product page. */
router.post('/upload', upload.single('img'), controllerProduct.uploadImgProduct);

/* POST add link img product */
router.post('/add-link-img', controllerProduct.addLinkImg);

/* GET delete link img */
router.get('/delete-link-img', controllerProduct.deleteLinkImg);

/* GET delete dir img */
router.get('/delete-img', controllerProduct.deleteImg);

/* GET product delete */
router.get('/product-delete', controllerProduct.deleteProduct);

/* POST insert-category page. */
router.post('/insert-category', controllerProduct.insertCategory);

/* POST insert-publisher page. */
router.post('/insert-publisher', controllerProduct.insertPublisher);


/* POST edit-category page. */
router.post('/edit-category', controllerProduct.editCategory);

/* POST edit-publisher page. */
router.post('/edit-publisher', controllerProduct.editPublisher);


/* GET category delete page. */
router.get('/category-delete', controllerProduct.deleteCategory);

/* GET publisher delete page. */
router.get('/publisher-delete', controllerProduct.deletePublisher);


module.exports = router;
