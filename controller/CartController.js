const Cart = require("../model/cartModel");
const cartHelper = require('../helpers/cartHelper')
const Address = require("../model/addressModel");
const User = require('../model/userModel')


const addToCart = async (req, res) => {
    try {
        // console.log(req.body,"Product Added");
        if (req.session.user) {
            const userId = req.session.user._id
            const { proId } = req.body;
            await cartHelper.addToCart(userId, proId)

            let cartCount = await cartHelper.getCartCount(userId)
            res.json({ status: true, cartCount })
        } else {
            res.json({ status: false })
        }
    } catch (error) {
        console.log(error);
    }
}


const loadCart = async (req, res) => {
    try {
        // const isUserLoggedIn = req.session.isUserLoggedIn || false;
        // const userName = isUserLoggedIn ? req.session.username : "";
        let cartCount = 0
        if (req.session.user) {
            cartCount = await cartHelper.getCartCount(req.session.user._id)
        }
        const userId = req.session.user._id
        let cartItems = await cartHelper.getCartProducts(userId)
        let totalAmount = 0
        if (cartItems.length) {
            totalAmount = await cartHelper.getTotalAmount(userId)
        }
        // console.log(cartItems);
        res.render('cart', { cartItems, cartCount , totalAmount,userId})
    } catch (error) {
        console.log(error);
    }
}



const changeProductQuantity = async(req, res) => {
    try {
        const product = await cartHelper.changeProductQuantity(req.body)
        console.log(product, 'product --------------');
        const totalAmount = await cartHelper.getTotalAmount(req.session.user._id)
        // console.log(totalAmount, 'total amount ------------------');
        res.json({product,totalAmount})
    } catch (error) {
        console.log(error);
    }
}




//Remove Product from Cart
const removeProduct = async (req, res) => {
    try {
        let response = await cartHelper.removeProduct(req.body)
        // console.log(req.body);
        res.json(response)
    } catch (error) {
        console.log(error);
    }
}

//Display checkOut
const displayCheckOut =async (req,res) =>{
    try {
        const userId = req.session.user._id;
        const totalAmount = await cartHelper.getTotalAmount(req.session.user._id)
        let cartCount = await cartHelper.getCartCount(req.session.user._id)
        const user = await User.findById(userId);
        const address = await Address.find({ user: userId });
        const addressList = await Address.findOne({ user: userId });
        // console.log(addressList);
        res.render("checkout", { cartCount, totalAmount, address, user, addressList, userId });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    loadCart,
    addToCart,
    changeProductQuantity,
    removeProduct,
    displayCheckOut

}


// const changeProductQuantity = async (req, res) => {
//     try {
//         const { cartId, proId, button, totalAmount } = req.body || {};
        
//         if (!cartId || !proId || !button) {
//             return res.status(400).json({ error: 'Invalid request parameters' });
//         }


//         const cartData = await Cart.findById(cartId).exec();
//         console.log(cartData,"ftrgrb")
//         if (!cartData) {
//             return res.status(404).json({ error: 'Cart not found' });
//         }

//         console.log(cartData.products);

//         const targetProductId = proId;

//         const indexToUpdate = cartData.products.findIndex(item => item.productId.toString() === targetProductId);

//         if (indexToUpdate !== -1) {
//             if (button === 'positive') {
//                 cartData.products[indexToUpdate].quantity += 1;
//                 cartData.products[indexToUpdate].price = cartData.products[indexToUpdate].quantity * totalAmount
//             }

//             if (button === 'negative' && cartData.products[indexToUpdate].quantity > 1) {
//                 cartData.products[indexToUpdate].quantity -= 1;
//                 cartData.products[indexToUpdate].price = cartData.products[indexToUpdate].quantity * totalAmount
//             }

//             try {
//                 await cartData.save();
//             } catch (error) {
//                 console.log(error);
//                 return res.status(500).json({ error: 'Error saving cartData' });
//             }

//             const quantityToUpdate = cartData.products[indexToUpdate].quantity;
//             const productPrice = cartData.products[indexToUpdate].price;

//             const totalPrice = cartData.products.reduce((accumulator, product) => {
//                 return accumulator + product.price;
//               }, 0);

//             console.log(totalPrice, "this is the cart data after update");
//             return res.json({ quantityToUpdate, productPrice });
//         } else {
//             console.log(`Product with productId ${targetProductId} not found in cartData`);
//             return res.status(404).json({ error: `Product with productId ${targetProductId} not found in cartData` });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
