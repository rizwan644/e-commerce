const {
    UserDefinedMessageList,
}=require("twilio/lib/rest/api/v2010/account/call/userDefinedMessage")

const User = require('../model/userModel')
const Category = require('../model/categoryModel')
const Product = require('../model/productModel')
const cartHelper = require('../helpers/cartHelper')
const Address = require('../model/addressModel')
const bcrypt = require('bcrypt')
const twilio = require("twilio")
const dotenv = require("dotenv")
dotenv.config()

const accountSid = "AC374661d306d609139039756b48f489a9"
const authToken = "061029044fae41f025ac92e4301bd58f"
const verifySid = "VA05bf641e6385c50d8f201b5c9495d30e"
const client = twilio(accountSid,authToken)
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.log(error);
    }
}



//load home page
const LoadHomepage = async(req,res)=>{
    try {
      const product = await Product.find({})
      let cartCount = await cartHelper.getCartCount(req.session.user)
        // console.log(product);
        res.render("home",{product:product,cartCount})

    } catch (error) {
        console.log(error)
    }
}



//load Register Page
const  loadRegisterPage = async (req,res)=>{
    try {
     
        res.render("sign-up")
    } catch (error) {
        console.log(error);
    }
}

const registerUser = async (req, res) => {
    try {
       
      const { username, email, mobile, password, pass2 } = req.body;
      // console.log(req.body);
      if (password !== pass2) {
        return res.render("sign-up", {
          message: "Password and confirm password do not match",
        });
      }
      if (!username || !email || !mobile || !password) {
        return res.render("sign-up", {
          message: "All fields are required",
        });
      }
  
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.render("sign-up", {
          message: "Email already exists",
        });
      }
  
      const existingMobile = await User.findOne({ mobile });
      if (existingMobile) {
        return res.render("sign-up", {
          message: "Mobile number already exists",
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        mobile,
        password: hashedPassword,
      });
  
      //send otp
      const phoneNumbers = [mobile];
      for (const phoneNumber of phoneNumbers) {
        const verification = await client.verify.v2
          .services(verifySid)
          .verifications.create({ to: `+91${phoneNumber}`, channel: "sms" });
      }
  
      // Store mobile in the session
      req.session.user = {
        username, // Corrected from user.name
        email,
        mobile,
        password: hashedPassword,
      };
      
      // console.log(mobile);
  
      res.render("verifyOtp");
    } catch (error) {
      console.log(error);
    }
  };
  
  // Resend OTP function
  const resendOTP = async (req, res) => {
    try {
      // Retrieve mobile from the session
      const mobile = req.session.usermobile;
  
      // Use mobile to resend OTP
      const phoneNumbers = [mobile];
      for (const phoneNumber of phoneNumbers) {
        const verification = await client.verify.v2
          .services(verifySid)
          .verifications.create({ to: `+91${phoneNumber}`, channel: "sms" });
      }
      res.redirect("/verifyOtp");
    } catch (error) {
      console.log(error.message);
      return res.render("verifyOtp", { message: "Incorrect" });
    }
  };


//verify otp
const verifingOTP = async (req, res) => {
  try {
    const otp = req.body.otp;
    const userData = req.session.user;
      const verification = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({
          to: `+91${userData.mobile}`,
          code: otp,
        });
  if (verification.status === "approved") {
      console.log("Verification successful!");

    // req.session.user_id = req.session.user_id; // Clear OTP after successful verification
      const user = new User({
        username: userData.username,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password
      });

      await user.save();

      return res.redirect("/login");
      // return res.render('registration', { message: 'Register successful' });
    } else {
      // Incorrect OTP
      return res.render("verifyOtp", { message: "Incorrect OTP" });
    }
  } catch (error) {
    console.log(error);
  }
}



//load Login page
const loadLoginPage =async (req,res)=>{
  try {
    let cartCount = 0
    if(req.session.user){
     cartCount = await cartHelper.getCartCount(req.session.user._id)
    }
      res.render("login",{cartCount})
  } catch (error) {
      console.log(error)
  }
}


//verify login
const verifyLogin = async (req,res)=>{
    try {
        const {email,password} = req.body
        // console.log(mobile);
        const UserData = await User.findOne({email:email})
        // console.log(UserData,"jhgj")
        if(!UserData){
            res.redirect('/sign-up')
        }else{
            const matchPassword = await bcrypt.compare(password,UserData.password)
            console.log(matchPassword)
            if(!matchPassword){
                res.redirect('/login')
            }else{
              req.session.user= UserData
                res.redirect('/home')
            }
        }
    } catch (error) {
       console.log(error); 
    }
}


//single product view
// const loadSingle = async (req, res) => {
//   try {
//     const id = req.query.id;
//     const product = await Product.find({ })
//     let cartCount = await cartHelper.getCartCount(req.session.user)
//     const user = req.session.user; // Check if user session exists
//     // const review = await Review.find({ product: id }).populate("user");
//     console.log(product,"jhhhahahahahahhh-------------------");
//     res.render("Single", { user, product: product, cartCount });
//   } catch (error) {
//     console.log(error);
//     // res.send({ success: false, error: error.message });
//   }
// };
// const loadSingle = async (req, res) => {
//   try {
//     const id = req.query.id;
//     const product = await Product.find(id);
//     let cartCount = await cartHelper.getCartCount(req.session.user);
//     const user = req.session.user;
//     console.log(product,"jhhhahahahahahhh-------------------");
//     res.render("Single", { user, product, cartCount });
//   } catch (error) {
//     console.log(error);
//   }
// }
const loadSingle = async (req, res) => {
  try {
    const productId = req.query.id;
    const product = await Product.findById(productId);
    if (!product) {
      // Handle the case when the product is not found
      return res.status(404).send('Product not found');
    }

    const cartCount = await cartHelper.getCartCount(req.session.user);
    const user = req.session.user;

    res.render('product-detail', { user, product, cartCount });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


//shop product 
const shopProduct = async (req,res)=> {
  try {
    const product = await Product.find({})
    const categories = await Category.find()
    let cartCount = await cartHelper.getCartCount(req.session.user._id)
    // console.log(product);
    res.render("shopProduct",{product:product,categories,cartCount})
    } catch (error) {
    console.log(error);
  }
}

//logout
const logout = (req,res)=>{
  try {
    req.session.destroy()

  } catch (error) {
    console.log(error);
  }
}

//user profile
const userProfile =async (req,res)=>{
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    let cartCount = await cartHelper.getCartCount(req.session.user._id)
    const address = await Address.find({ user: userId });
    console.log(address);
    res.render("userPro",{user,address,cartCount})
  } catch (error) {
    console.log(error);
  }
}


module.exports={
    LoadHomepage,
    loadRegisterPage,
    registerUser,
    loadLoginPage,
    verifyLogin,
    resendOTP,
    verifingOTP,
    shopProduct,
    loadSingle,
    userProfile
} 