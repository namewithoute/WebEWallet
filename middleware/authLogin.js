var authUserLogin=function (req,res,next){
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