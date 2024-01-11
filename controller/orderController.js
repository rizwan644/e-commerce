const Cart = require("../model/cartModel");
const cartHelper = require("../helpers/cartHelper");
const orderHelper = require("../helpers/orderHelper");


// placing order AJAX function
const placeOrder = (req,res)=>{
    console.log(req.body);
}

module.exports = {
    placeOrder
}