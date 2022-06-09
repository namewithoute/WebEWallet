var multiparty = require('multiparty')
var user_account=require('../models/userAccount')
var moneyInAcc=require('../models/moneyInAccount')
var shortid = require('shortid')
var fs=require('fs')

var sendmail=require('../middleware/sendMail')


function getRegister (req, res) {
    res.render('RegisterForm')
}



async function postRegister(req, res) {
    const form = new multiparty.Form()
  
    form.parse(req, async (err, fields, files) => {
        console.log(fields)
        var findEmail = await user_account.findOne({email:fields.email[0]})
        if(findEmail!=null){
            req.session.flash = {
                type: 'error',
                message: 'Email này đã tồn tại'
            }
            res.redirect('/register')
            return
        }
        var findSdt = await user_account.findOne({sdt:fields.phonenumber[0]})
        if(findSdt!=null){
            req.session.flash = {
                type: 'error',
                message: 'Số điện thoại này đã tồn tại'
            }
            res.redirect('/register')
            return
        }
        var username_id = Math.floor(Math.random() * 10000000000)
        var user_pass = Math.floor(Math.random() * 1000000)

        if (err) return res.status(500).send(err.message)
        var filename_truoc = files.cmndtruoc[0].originalFilename.split('.')
        var filetype_truoc = filename_truoc[filename_truoc.length - 1]

        var filename_sau = files.cmndsau[0].originalFilename.split('.')
        var filetype_sau = filename_sau[filename_sau.length - 1]

        var oldPath_truoc = files.cmndtruoc[0].path;

        var filecmnd_truoc = shortid.generate() + '.' + filetype_truoc;
        var filecmnd_sau = shortid.generate() + '.' + filetype_sau;
        var newPath_truoc = '../source/public/img_cmnd/' + filecmnd_truoc
        fs.rename(oldPath_truoc, newPath_truoc, function (err) {
            if (err) throw err;
            console.log('Successfully renamed - AKA moved!')
        })

        var oldPath_sau = files.cmndsau[0].path;
        var newPath_sau = '../source/public/img_cmnd/' + filecmnd_sau
        fs.rename(oldPath_sau, newPath_sau, function (err) {
            if (err) throw err;
            console.log('Successfully renamed - AKA moved!')
        })
        var date = new Date();
        new user_account({
            username: username_id,
            password: user_pass,
            email: fields.email[0],
            ho_ten: fields.name[0],
            ngay_sinh: fields.date[0],
            dia_chi: fields.diachi[0],
            sdt: fields.phonenumber[0],
            trang_thai: "Chờ xác minh",
            trang_thai_dangnhap: 0,
            sl_nhap_sai: 0,
            tinhtrang_doimk: 0,
            ngay_tao: date,
            ngay_capnhat:date,
            cmnd_truoc: filecmnd_truoc,
            cmnd_sau: filecmnd_sau

        }).save();
        new moneyInAcc({
            username:username_id,
            amount:0
        }).save()
        sendmail(fields.email[0], username_id, user_pass)

        // console.log('field data: ', fields)
        // console.log('files: ', files)
        res.redirect(303, '/login')
    })
}


module.exports={
    getRegister:getRegister,
    postRegister: postRegister
}