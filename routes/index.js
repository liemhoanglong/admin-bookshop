const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const admins =require('../model/admins.model');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
	if (req.user.type === 1) {
		res.render('index', {title : 'Trang chủ', user: req.user});
	} else {
		req.flash('error_msg', 'Bạn không được phép truy cập vào đây!');
			res.redirect('/account');
	}
});

/* GET day page. */
router.get('/day', function(req, res, next) {
	res.render('day', {title : 'Báo cáo theo ngày'});
});

/* GET week page. */
router.get('/week', function(req, res, next) {
	res.render('week', {title : 'Báo cáo theo tuần'});
});

/* GET month page. */
router.get('/month', function(req, res, next) {
	res.render('month', {title : 'Báo cáo theo tháng'});
});

/* GET quarter page. */
router.get('/quarter', function(req, res, next) {
	res.render('quarter', {title : 'Báo cáo theo quý'});
});

/* GET year page. */
router.get('/year', function(req, res, next) {
	res.render('year', {title : 'Báo cáo theo năm'});
});

module.exports = router;
