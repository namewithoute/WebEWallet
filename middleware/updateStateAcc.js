var user_account = require('../models/userAccount')

module.exports = async function (req, res) {
    console.log(req.body.trang_thai,req.body.username)
    if (req.body.trang_thai == 'Chờ cập nhật') {
        await user_account.updateOne({ username: req.body.username }, { trang_thai: 'Chờ cập nhật' })
    }
    else if (req.body.trang_thai == 'Chờ xác minh') {
        await user_account.updateOne({ username: req.body.username }, { trang_thai: 'Chờ xác minh' })
    }
    else if (req.body.trang_thai == 'Vô hiệu hóa') {
        await user_account.updateOne({ username: req.body.username }, { trang_thai: 'Đã vô hiệu hóa' })
    }
    else if(req.body.trang_thai=='Xác minh'){
        var date = new Date()
        await user_account.updateOne({username:req.body.username},{trang_thai:'Đã xác minh',sl_nhap_sai:0,trang_thai_dangnhap:0, ngay_capnhat:date})
    }
    res.json({status:'success'})
}