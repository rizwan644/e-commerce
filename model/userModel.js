const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isBlocked: {
        type: Boolean,
        default:false
    },   
    //  deliveryAddress: [
    //     {
    //         firstName: String,
    //         lastName: String,
    //         phone: String,
    //         email: String,
    //         address1: String,
    //         address2: String,
    //         city: String,
    //         state: String,
    //         country: String,
    //         pincode: String,
    //     }
    // ]

})

module.exports = mongoose.model('User',userSchema)
