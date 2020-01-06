require('dotenv').config()
//1.require mongoose
var mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userID: String,
    items: [{
        productID: String,
        quantity: Number
    }],
    totalQuantity: Number,
    totalPrice: Number,
    name: String,
    phone: String,
    status: String,
    shipping: String,
    timeline:{
        ordering: Number,
        waiting: Number,
        delivering: Number,
        delivered: Number
    },
    feeShipping: Number,
    payment: String,
    address: String
}, {collection: 'orders'});

const orders = mongoose.model('orders', orderSchema);

module.exports.getAllOrder = function() {
	return orders.find();
}


module.exports = orders;
