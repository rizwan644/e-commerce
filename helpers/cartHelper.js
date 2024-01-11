const mongoose = require("mongoose");
const Cart = require("../model/cartModel");
const Product = require("../model/productModel");

module.exports = {


  //add products to cart
  addToCart: (userId, proId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let productObj = {
          productId: proId,
          quantity: 1,
        };

        let userCart = await Cart.findOne({ user: userId });

        if (userCart) {
          let productExist = userCart.products.findIndex(
            (product) => product.productId == proId
          );

          if (productExist !== -1) {
            Cart.updateOne(
              { user: userId, "products.productId": proId },
              {
                $inc: { "products.$.quantity": 1 },
              }
            ).then((response) => {
              resolve(true);
            });
          } else {
            Cart.findByIdAndUpdate(userCart._id, {
              $push: { products: productObj },
            }).then((response) => {
              resolve(true);
            });
          }
        } else {
          const newCart = new Cart({
            user: userId,
            products: productObj,
          });
          newCart.save().then((response) => {
            resolve(true);
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  },


  //display number of products from the cart in header section
  getCartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let length = 0;
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
          length = cart.products.length;
          resolve(length);
        } else {
          resolve(length);
        }
      } catch (error) {
        reject(error);
      }
    });
  },



  getCartProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userObjId = new mongoose.Types.ObjectId(userId);

        let cartItems = await Cart.aggregate([
          {
            $match: { user: userObjId },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              productId: "$products.productId",
              quantity: "$products.quantity",
              cartItem: "$products._id",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productDetails",
            },
          },
          {
            $project: {
              productId: 1,
              quantity: 1,
              cartItem: 1,
              product: { $arrayElemAt: ["$productDetails", 0] },
            },
          },
          {
            $project: {
              productId: 1,
              quantity: 1,
              cartItem: 1,
              product: 1,
            },
          }
        ]);

        resolve(cartItems);
      } catch (error) {
        reject(error);
      }
    });
  },

  //Increment or Decrement the quantity of the product in the cart
  changeProductQuantity: (cartThings) => {
    cartThings.count = parseInt(cartThings.count)
    const { cartId, proId, count} = cartThings;
    // console.log(cartThings);
    return new Promise(async (resolve, reject) => {
      try {
        const product = await Product.findById(proId)
        // console.log(product);
        let stock = product.stock
        // console.log(stock);
        let cartItemQty = await await Cart.findOne(
          { _id: cartId },
          {
            products: { $elemMatch: { productId: proId } },
          }
        );
        const quantity = cartItemQty.products[0].quantity
        //  console.log(cartItemQty,'cart quantity ----------------------');
        if (count == 1 && quantity >= stock) {
          limitExceed = true;
          resolve({ limitExceed });
        } else {
          await Cart.findOneAndUpdate(
            { _id: cartId, "products.productId": proId },
            {
              $inc: { "products.$.quantity": count },
            }
          )
          const cartItem = await Cart.findOne(
            { _id: cartId },
            {
              products: { $elemMatch: { productId: proId } },
            }
          );
          // console.log(cartItem);
          resolve(cartItem.products[0])
        }
      } catch (error) {
        reject(error);
      }
    })
  },




  //Remove Product from Cart
  removeProduct: (cartData) => {
    const { cartId, cartItem } = cartData;
    return new Promise(async (resolve, reject) => {
      try {
        await Cart.updateOne(
          { _id: cartId },
          {
            $pull: { products: { _id: cartItem } },
          }
        ).then(() => {
          resolve(true);
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  //Total amount
  getTotalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const userObjId = new mongoose.Types.ObjectId(userId);

        let totalAmount = await Cart.aggregate([
          {
            $match: { user: userObjId },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              productId: "$products.productId",
              quantity: "$products.quantity",
              cartItem: "$products._id",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productDetails",
            },
          },
          {
            $project: {
              productId: 1,
              quantity: 1,
              cartItem: 1,
              product: { $arrayElemAt: ["$productDetails", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $multiply: [{ $toDouble: "$quantity" }, { $toDouble: "$product.originalprice" }], // Convert both to double
                },
              },
            },
          },
        ]);
        // console.log(totalAmount);
        resolve(totalAmount[0].total);
      } catch (error) {
        reject(error);
      }
    });
  },


}