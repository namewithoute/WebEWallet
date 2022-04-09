var user_account=require('../models/userAccount')
var authUserLogin=async function (req,res,next){
    if(req.session.userEmail){
        var user = await user_account.findOne({email:req.session.userEmail})
        if(user){
            req.session.userId=user.username
            console.log(req.session.userId)
        }
    }
    if(req.session.userId){
        next()
    }
    else{
        req.session.flash = {
            type: 'error',
            message: 'Bạn cần phải đăng nhập trước khi sử dụng dịch vụ này'
        }
        res.redirect('/login')
    }
}

module.exports=authUserLogin