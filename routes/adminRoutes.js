const express = require('express')
const admin_Route = express();
const adminController = require('../controller/adminContoller')
const categoryControllerr = require('../controller/categoryController')
const productController = require('../controller/productController')
const multer = require('../multer/multer')


admin_Route.set('view engine','ejs') 
admin_Route.set('views','./views/admin')

admin_Route.use(express.json());
admin_Route.use(express.urlencoded({extended: true}));

admin_Route.use(express.json());
admin_Route.use(express.urlencoded({ extended: true }));

//admin login & logout
admin_Route.get('/Login',adminController.adminLogin);
admin_Route.post('/Login',adminController.verifyAdminLogin)
admin_Route.get('/home',adminController.adminLogout)

//dashboard
admin_Route.get('/dashboard',adminController.loadadminpage)
admin_Route.get('/dashboard',adminController.verifyAdminLogin)

//User List
admin_Route.get('/loadUserlist',adminController.loadUserlist)
admin_Route.get('/blockUser',adminController.blockUser)
admin_Route.get('/unBlockUser',adminController.unBlockUser)

//category
admin_Route.get('/category',categoryControllerr.loadCategory)
admin_Route.post('/category',categoryControllerr.CreateCategory)
admin_Route.get('/changeStatus',categoryControllerr.changeStatus)
admin_Route.get('/editCategory',categoryControllerr.loadEditCategory)
admin_Route.post("/editCategory", categoryControllerr.updateCategory);



//product
admin_Route.get('/productList',productController.loadproductList)
admin_Route.get('/addProduct',productController.loadAddProduct)
admin_Route.post("/addProduct", multer.array("images", 4), productController.createProduct);
admin_Route.get('/editProduct',productController.loadEditProduct)
admin_Route.post("/editProduct", productController.updateProductList);



module.exports = admin_Route;
