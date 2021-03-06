
var user_account=require('../models/userAccount')

function changepassGET(req, res) {
    if ((req.session.userId && req.session.doi_mk == 0)|| req.session.userEmail)
        res.render('ChangePassword')
    else if(req.session.userId && req.session.doi_mk == 1){
        res.render('ChangePassword2')
    }
    else
        res.redirect('/login')
}

//Đổi mk lần đầu
async function changePass1POST(req, res) {
    if(req.session.userEmail){
        var user = await user_account.findOne({email:req.session.userEmail})
        if(user)
        req.session.userId=user.username
    }
    if (req.body.password1 == req.body.password2) {
        await user_account.updateOne({ username: req.session.userId }, {
            $set: {
                password: req.body.password1,
                tinhtrang_doimk: 1
            }
        })
        if(req.session.type==1){
            req.session.destroy()
            res.redirect('/login')
            return
        }
        res.redirect('/')
    }
    else {
        req.session.flash = {
            type: 'error',
            message: 'Mật khẩu không trùng khớp'
        }
        res.redirect('/changepassword')
    }
}
//đổi mật khẩu người dùng muốn
async function changePass2POST(req,res){
    var checkOldPass= await user_account.findOne({username:req.session.userId,password:req.body.oldPass})
    if(!checkOldPass){
        req.session.flash = {
            type: 'error',
            message: 'Sai mật khẩu '
        }
        res.redirect('/changepassword')
        return
    }
    if(req.body.password1!=req.body.password2){
        req.session.flash = {
            type: 'error',
            message: 'Mật khẩu không trùng khớp'
        }
        res.redirect('/changepassword')
        return
    }
    await user_account.updateOne({username:req.session.userId},{password:req.body.password1})
    req.session.flash = {
        type:'success',
        message:'Đổi mật khẩu thành công'
    }
    res.redirect('/information')
}

module.exports={
    changepassGET,
    changePass1POST,
    changePass2POST
}