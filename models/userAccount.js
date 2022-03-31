var mongoose = require('mongoose')

var user_accountSchema=mongoose.Schema({
    username:String,
    password:String,
    email:String,
    ho_ten:String,
    ngay_sinh:Date,
    dia_chi:String,
    sdt:String,
    trang_thai:{type:String, default: "Chờ xác minh"},
    trang_thai_dangnhap:Number,
    sl_nhap_sai:Number,
    tinhtrang_doimk:Number,
    ngay_tao:Date,
    cmnd_truoc:String,
    cmnd_sau:String

})
var user_account=mongoose.model('user_account',user_accountSchema)
module.exports=user_account;