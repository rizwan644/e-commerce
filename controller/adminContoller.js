const Admin = require('../model/adminModel')
const User = require("../model/userModel");

const bcrypt =  require('bcrypt')

//Load admin login page
const adminLogin = (req,res)=>{          
    try {
        res.render('adminLogin')
    } catch (error) {
        console.log(error);
    }
}

// bcrypt.hash('admin@01',10).then((pass)=>{
//     console.log(pass);
// })

//load adminpage 
const loadadminpage = (req,res)=>{
    try {
        res.render("dashboard")
    } catch (error) {
        console.log(error);
    }
}

//verify adminLogin
const verifyAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const AdminData = await Admin.findOne({ email: email });
        console.log(AdminData);

        if (!AdminData) {
            return res.render('adminLogin', {
                message: "admin not found"
            });
        }

        const adminMatchPassword = await bcrypt.compare(password, AdminData.password);
        console.log(AdminData.password);

        if (!adminMatchPassword) {
            return res.render('adminLogin', {
                message: "Password does not match"
            });
        }

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
    }
}


//load User List
const loadUserlist = async (req, res) => {
    try {
      let search = "";
      if (req.query.search !== undefined && req.query.search !== "") {
        search = req.query.search;
      }
  
      const userData = await User.find({
        $or: [
          { name: { $regex: ".*" + search + ".*" } },
          { email: { $regex: ".*" + search + ".*" } },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$mobile" },
                regex: ".*" + search + ".*",
              },
            },
          },
        ],
      });
  console.log(userData);
      res.render("listUser", { user: userData });
    } catch (error) {
      console.log(error.message);
    }
  };


  //block User
const blockUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.updateOne({ _id: id }, { $set: { isBlocked: true } });
    res.redirect("/admin/loadUserlist");
  } catch (error) {
    console.log(error);
  }
};

//Unblock User
const unBlockUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.updateOne({ _id: id }, { $set: { isBlocked: false } });
    res.redirect("/admin/loadUserlist");
  } catch (error) {
    console.log(error);
  }
}


  //logout
  const adminLogout = (req,res) => {
    try {
      res.redirect("/home")
    } catch (error) {
      console.log(error);
    }
  }
module.exports ={
    adminLogin,
    verifyAdminLogin,
    loadadminpage,
    loadUserlist,
    blockUser,
    unBlockUser,
    adminLogout
}