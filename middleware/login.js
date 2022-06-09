var user_account=require('../models/userAccount')
var admin_acc = require('../models/adminAccount')


function loginGet(req,res){
    if(!req.session.userId)
    res.render('LoginForm')
    else
    res.redirect('/')
}

async function loginPost(req,res){
    var admin = await admin_acc.findOne({username:req.body.username,password:req.body.password})
    if(admin){
        req.session.role="admin"
        res.redirect('/admin/account')
        return
    }

    var nhapsai = await user_account.findOne({ username: req.body.username })
    if(nhapsai==null){
        req.session.flash = {
            type: 'error',
            message: 'Sai tài khoản hoặc mật khẩu'
        }
        res.redirect('/login')
        return
    }
    if(nhapsai.trang_thai_dangnhap==2){
        req.session.flash = {
            type: 'block',
            message: 'Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ'
        }
        res.redirect('/login')
        return
    }
    if (req.session.block == true && nhapsai!=null) {
        req.session.flash = {
            type: 'block',
            message: 'Bạn đã nhập sai 3 lần, tài khoản của bạn bị tạm khóa 1 phút'
        }
        res.redirect('/login')
        return
    }
    var find = await user_account.find({ $and: [{ username: req.body.username }, { password: req.body.password }] })
    if (find.length != 0) {
        if(find[0].trang_thai=='Đã vô hiệu hóa'){
            req.session.flash = {
                type: 'block',
                message: 'Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008'
            }
            res.redirect('/login')
            return
        }
       //nhập đúng
        req.session.userId = find[0].username
        req.session.doi_mk = find[0].tinhtrang_doimk
        req.session.nhap_sai = find[0].sl_nhap_sai
        if (find[0].tinhtrang_doimk == 0) {
            res.redirect('/changepassword')
        }
        else if (find[0].tinhtrang_doimk == 1) {
            res.redirect('/')
        }
        await user_account.updateOne({ username: req.body.username }, { sl_nhap_sai: 0, trang_thai_dangnhap: 0 })
    }
    else {
       
        if (nhapsai != null) {

            if (nhapsai.sl_nhap_sai == 2) {
                req.session.flash = {
                    type: 'block',
                    message: 'Bạn đã nhập sai 3 lần, tài khoản của bạn bị tạm khóa 1 phút'
                }
                await user_account.updateOne({ username: req.body.username }, {sl_nhap_sai:nhapsai.sl_nhap_sai+1, trang_thai_dangnhap: nhapsai.trang_thai_dangnhap + 1 })
                req.session.block = true
                setTimeout( function () {
                    req.session.destroy()
                    console.log('delete success')
                }, 60000)
                res.redirect('/login')
                return
            }
            else if(nhapsai.sl_nhap_sai==5){
                await user_account.updateOne({ username: req.body.username }, {sl_nhap_sai:nhapsai.sl_nhap_sai+1, trang_thai_dangnhap: nhapsai.trang_thai_dangnhap + 1 ,trang_thai:'Bị khóa vô thời hạn'})
                req.session.flash = {
                    type: 'error',
                    intro: 'wrong pass or username',
                    message: 'Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ'
                }
                res.redirect('/login')
                return
            }
            else {
                await user_account.updateOne({ username: req.body.username }, { sl_nhap_sai: nhapsai.sl_nhap_sai + 1 })
            }
        }
        req.session.flash = {
            type: 'error',
            intro: 'wrong pass or username',
            message: 'Sai tài khoản hoặc mật khẩu'
        }

        res.redirect('/login')
    }
}

module.exports={
    loginGet:loginGet,
    loginPost:loginPost
}