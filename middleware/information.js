var user_account=require('../models/userAccount')
var moment=require('moment')
module.exports=async function(req,res){

    var infor = await user_account.findOne({username:req.session.userId})
    var newdata={
        username:infor.username,
        ho_ten:infor.ho_ten,
        sdt:infor.sdt,
        email:infor.email,
        ngay_sinh:moment(infor.ngaysinh).format('L'),
        dia_chi:infor.dia_chi,
        cmnd_truoc:infor.cmnd_truoc,
        cmnd_sau:infor.cmnd_sau,
        trang_thai:infor.trang_thai
    }
    console.log(newdata)
    res.render('information',{result:newdata})
}