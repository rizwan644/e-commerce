const mongoose = require('mongoose');

const cartModel = mongoose.Schema({
        
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          total: {
            type: Number,
            required: true,
            default:0
          },
          products: [
            {
              productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
              },
              quantity: {
                type: Number,
                required: true,
                default: 1,
              },
              // price:{
              //   type:Number,
              //   required:true,
              //   default: 0
              // }
            },
          ],
        },
        { timestamps: true }
      );


module.exports = mongoose.model('Cart',cartModel)
