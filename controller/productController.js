const Product = require("../model/productModel");
const Category = require("../model/categoryModel");


//load add product
const loadAddProduct = async (req,res) =>{
    try {
        let categories = await Category.find({});
        res.render("addProduct", { category: categories });    
    } catch (error) {
        console.log(error);
    }
}


//create product
const createProduct = async (req,res)=>{
    try {
        const {name,description,category,brand,stock,originalprice,productprice} = req.body
        const images = req.files.map((file)=>file.filename)
        const updatedImages = images.length > 0 ? images : productData.images;
        let categories = await Category.find({});

        const newProduct = new Product({
           name,
           description,
           category,
           brand,
           stock,
           originalprice,
           productprice,
           images:updatedImages
        })

        newProduct.save().then(() => {
            res.render("addProduct",{
                message:"product added succesfully",
                category: categories
            })
        })
    }  catch (error) {
        if (error.errors) {
            const missingFields = Object.keys(error.errors).join(', ');
            res.status(400).json({ error: `Missing required fields: ${missingFields}` });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    

}


//load productList
const loadproductList =async (req,res) => {
    try {
        const product = await Product.find({}).populate('category')
        res.render("productList", { product: product });    
    } catch (error) {
        console.log(error);
    }
}


//Edit product
const loadEditProduct = async (req,res) => {
    try {
        const id = req.query.id;
        const product = await Product.findById({_id: id})
        let categories = await Category.find({});
        const selectedCategory = await Category.findOne({ _id: product.Category });
        res.render('editProduct',{product:product,
                                categories,
                                selectedCategory})
    } catch (error) { 
        console.log(error);
    }
}


//Update  product List
const updateProductList = async (req, res) => {
    try {
        console.log("fvbbv.");
  
        const id = req.body.id;
        const name = req.body.name;
        const description = req.body.description;
        const brand = req.body.brand
        const originalprice = req.body.originalprice;
        const category = req.body.category;
        const status = req.body.isListed === "listed";
        // const images = req.files.map((file) => file.filename);    senjiii
      
      // Find the existing product data
      //senji
        const productData = await Product.findById(id);

      // Check if new images are provided
        // const updatedImages = images.length > 0 ? images : productData.images;
       
       //senji
        const update = await Product.updateOne(
            { _id: id },
            {
                $set: {
                name: name,
                description: description,
                brand:brand,
                originalprice: originalprice,
                category: category,
                isListed: status,
                // images: updatedImages,
          },
        }
      );
      res.redirect("/admin/productList");
    } catch (error) {
      console.log(error.message);
    } 
  };



module.exports = {
    loadAddProduct,
    createProduct,
    loadproductList,
    loadEditProduct,
    updateProductList
}