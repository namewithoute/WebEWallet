var user_account=require('../models/userAccount')

var authUserAccount= async function(req,res,next){
    
    var statusAcc = await user_account.findOne({username:req.session.userId})
    if(statusAcc.trang_thai=='Chờ xác minh' || statusAcc.tinhtrang_doimk==0){
        req.session.flash = {
            type: 'error',
            message: 'Tính năng này chỉ dành cho các tài khoản đã được xác minh'
        }
        res.json('Sai')
        return
    }
    // if(statusAcc.trang_thai=='Chờ xác minh' && statusAcc.tinhtrang_doimk==0){
    //     res.
    // }
    if(statusAcc.trang_thai=='Đã xác minh' || statusAcc.tinhtrang_doimk==1){
        next()
    }
}

module.exports=authUserAccount