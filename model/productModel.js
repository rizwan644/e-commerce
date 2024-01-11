const mongoose = require('mongoose')
const category = require('./categoryModel')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    originalprice: {
        type:String,
        required: true,
    },
    productprice:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    images:{
        type:Array,
        required:true
    },
    isListed:{
        type:Boolean,
        default:true
    },


})

module.exports = mongoose.model('Product',productSchema)