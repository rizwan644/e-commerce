const express = require('express')
const userController = require('../controller/userController')
const CartController = require('../controller/CartController')
const addressController = require('../controller/addressController')
const orderController = require('../controller/orderController')

const validate = require('../middlewares/isLoggedIn')


const userRoute = express()

userRoute.set('view engine','ejs') 
userRoute.set('views','./views/user')

userRoute.use(express.json());
userRoute.use(express.urlencoded({extended: true}));


//Home
userRoute.get('/',validate.requireAuth,userController.LoadHomepage)
userRoute.get('/home',validate.requireAuth,userController.LoadHomepage)


//Sign up
userRoute.get('/sign-up',userController.loadRegisterPage)
userRoute.post('/sign-up',userController.registerUser)


//Login
userRoute.get('/login', userController.loadLoginPage)
userRoute.post('/login',userController.verifyLogin)


//OTP
userRoute.get('/verifyOTP',userController.registerUser)
userRoute.post('/verifyOTP',userController.verifingOTP)
userRoute.post('/resend',userController.resendOTP)


//product
userRoute.get('/product-detail',validate.requireAuth,userController.loadSingle)
userRoute.get('/shopProduct',validate.requireAuth,userController.shopProduct)


//Cart
userRoute.get('/cart',validate.requireAuth,CartController.loadCart)
userRoute.post('/addToCart', validate.requireAuth, CartController.addToCart);
userRoute.post('/change-product-quantity',validate.requireAuth,CartController.changeProductQuantity)
userRoute.post('/remove-product', validate.requireAuth, CartController.removeProduct) 
userRoute.get('/checkout',validate.requireAuth,CartController.displayCheckOut)


//profile
userRoute.get('/userPro',validate.requireAuth,userController.userProfile)


//address
userRoute.post('/addAddress',validate.requireAuth,addressController.addAddress)
userRoute.get('/deleteAddress/:userId/:addressId', validate.requireAuth, addressController.deleteAddress);
userRoute.post('/editAddress/:addressId',validate.requireAuth,addressController.editAddress)
 

//order place
userRoute.post('/place-order',validate.requireAuth,orderController.placeOrder)



module.exports= userRoute