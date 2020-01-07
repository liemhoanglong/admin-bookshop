const products =require('../model/products.model');
const categories =require('../model/categories.model');
const publishers =require('../model/publishers.model');
const admins = require('../model/admins.model');
const orders = require('../model/orders.model');

const passport = require('passport');
const bcrypt = require('bcryptjs');
const handlebars= require('hbs');

const status = ["Chưa giao","Đang giao","Đã giao"];


handlebars.registerHelper("status_select",(selectedStatus, type_list)=>{
	let html = "";
	type_list.forEach(function(item) { 
		if(item == selectedStatus)
		{
			html = html + '<option selected value="'+item+'">' + item + '</option>';
		}
		else{
			html = html + '<option value="'+item+'">' + item + '</option>';
		} 
	});
	return new handlebars.SafeString(html);
});

module.exports.showOrder = (req, res, next) => {
	if (req.user.type === 2) {		
		//orders.find()
		orders.getAllOrder()
		.then((order) => {
			res.render('order', {
				title : 'Danh sách đơn hàng', 
				order: order
			});
		});
	} else {
		req.flash('error_msg', 'Bạn không được phép truy cập vào đây!');
		res.redirect('/account');
	}
};

module.exports.eachOrder = (req, res) => {
	orders.getOrderByID(req.query.id)
	.then((order) => {
		res.render('order-detail', {
			title : 'Chi tiết đơn hàng', 
			order,
			status
		});
	});
};

module.exports.updateOrder = (req, res) => {
	orders.getOrderByID(req.query.id)
	.then((order) => {
		order.status = req.body.status;
		order.save();
	});
	temp = "/orders-detail?id=" +	req.query.id;
	res.redirect(temp);

};