const { resetWatchers } = require('nodemon/lib/monitor/watch')
var sendotp=require('../middleware/sendOTP')
var user_account=require('../models/userAccount')
function forgetpassGET(req,res){
    res.render('forgetpassword')
}

async function forgetpassPOST(req,res){
  
    var checkemail=await user_account.findOne({email:req.body.email})
    
    if(checkemail){
        var otp = Math.floor(Math.random() * 10000)
        req.session.otp=otp
        sendotp(req.body.email,otp)
        setTimeout(function(){
            console.log(req.session.otp)
            delete req.session.otp
            // req.session.destroy()
            console.log('delete session success')
            console.log(req.session.otp)
        },60000)
        req.session.userEmail=req.body.email
        req.session.type=1
        res.redirect('/otpcode')
    }
    else{
        req.session.flash={
            code:1,
            message:"Tài khoản không tồn tại"
        }
        res.redirect('/forgetpassword')
    }
}

module.exports={
    forgetpassPOST,
    forgetpassGET
}