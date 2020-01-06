const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const admins =require('../model/admins.model');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const controllerOrders =require('../controllers/order.controller');


/* GET order list page. */
router.get('/orders', ensureAuthenticated, controllerOrders.showOrder);
// router.get('/orders', controllerOrders.showOrder);

/* GET order detail page. */
router.get('/orders-detail', controllerOrders.eachOrder);

/* post update order page. */
router.post('/update-order', controllerOrders.updateOrder);









module.exports = router;
