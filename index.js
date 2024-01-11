const express = require('express')

const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
var session = require('express-session')
app.set('view engine','ejs')

//Mongodb Config
mongoose.connect('mongodb://127.0.0.1:27017/camera').then(()=>{
    console.log("DB Connected");
}).catch((error)=>{
    console.log(`DB ERROR ${error}`);
})

app.use(
    session({
      secret: "your-secret-key", // Replace with your secret key
      resave: false,
      saveUninitialized: true,
      // You can configure other options as needed
    })
  );
  
app.use(express.static('public'))
app.use(express.static(__dirname+'/public/frontend/cam'))
// app.use(express.static(__dirname+'/public/admin/evar-backend/evar-backend'))
//for User Routes 
const userRoute = require('./routes/userRoutes')
app.use('/',userRoute)

//for admin route
const admin_Route = require('./routes/adminRoutes')
app.use('/admin',admin_Route)

app.listen(4000,()=>{
    console.log('server is started running http://localhost:4000')
})