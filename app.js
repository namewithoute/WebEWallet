const express = require('express')
const app = express()
var path = require('path')
// var nodemailer = require('nodemailer');
// const multiparty = require('multiparty')
const fs = require('fs')
// const shortid = require('shortid')

var homeRouter=require('./routes/homeRouter')
var registerRoute=require('./routes/registerRoute')
var loginRoute=require('./routes/loginRoute')
var changepassRoute = require('./routes/changepassRoute')
var informationRoute=require('./routes/informationRoute')
var forgetpassRoute=require('./routes/forgetpassRoute')
var checkOTP=require('./routes/checkOTPRoute')
var depositRoute=require('./routes/depositRoute')
var withdrawRoute=require('./routes/withdrawRoute')
var adminRoute=require('./routes/adminHomeRoute')
var getNameRoute=require('./routes/getNameTransRoute')
var transferRoute=require('./routes/transferRoute')
var confirmtransferRoute=require('./routes/confirmTransfer')
var updateCMNDRoute=require('./routes/updateCMNDRoute')
var updateStateAcc=require('./routes/updateStateAcc')
var confirmTransAdminRouter=require('./routes/confirmTransAdmin')
var historyTransUser=require('./routes/historyTransRoute')
var mongoose = require('mongoose')
var user_account = require('./models/userAccount')
var session = require('express-session');
const { emitWarning } = require('process');
const req = require('express/lib/request');
require('dotenv').config()


mongoose.connect('mongodb://localhost:27017/web_vidientu')

app.use(express.static(__dirname + '/public/'))


app.use(session({
    secret: 'abc',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },

}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))




app.set('view engine', 'ejs');
app.set('views', __dirname + "/views")

app.use(function (req, res, next) {
    res.locals.flash = req.session.flash
    delete req.session.flash
    next()
})




//tách file
app.use('/register',registerRoute)


//tách file login
app.use('/login',loginRoute)



app.get('/',homeRouter)
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/')
})  

app.use('/changepassword',changepassRoute)





app.use('/information',informationRoute)
app.use('/historytransaction',historyTransUser)


app.use('/admin',adminRoute)

app.use('/updatestateacc',updateStateAcc)
app.use('/confirmtransactionadmin',confirmTransAdminRouter)
app.use('/forgetpassword',forgetpassRoute)


app.use('/otpcode',checkOTP)

app.use('/updatecmnd',updateCMNDRoute)


app.use('/confirmtransfer',confirmtransferRoute)
app.use('/deposit',depositRoute)

app.use('/transfer',transferRoute)
app.use('/getnameuser',getNameRoute)
app.use('/withdraw',withdrawRoute)

app.listen(3000, function () {
    console.log("Listening at port 3000")
})