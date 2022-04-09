
function checkotpPOST(req,res){
   
    if (req.body.otp ==req.session.otp){
        res.redirect('/changepassword')
    }
    else{
        req.session.flash={
            code:1,
            message:'OTP không hợp lệ'
        }
        res.redirect('/otpcode')
    }
}

function checkOTPGET(req,res){
    if(req.session.userEmail)
    res.render('OTPmess')
    else
    res.redirect('/forgetpassword')

}

module.exports={
    checkotpPOST,
    checkOTPGET
}