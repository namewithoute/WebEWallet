const express = require('express')
const app = express()
// var nodemailer = require('nodemailer');
// const multiparty = require('multiparty')
const fs = require('fs')
// const shortid = require('shortid')
var CreditCard = require('./models/creditCard')
var registerRoute=require('./routes/registerRoute')
var loginRoute=require('./routes/loginRoute')
var changepassRoute = require('./routes/changepassRoute')
var informationRoute=require('./routes/informationRoute')
var forgetpassRoute=require('./routes/forgetpassRoute')
var checkOTP=require('./routes/checkOTPRoute')
var depositRoute=require('./routes/depositRoute')
var withdrawRoute=require('./routes/withdrawRoute')
var mongoose = require('mongoose')
var user_account = require('./models/userAccount')
var session = require('express-session');
const { emitWarning } = require('process');
const req = require('express/lib/request');
require('dotenv').config()


mongoose.connect('mongodb://localhost:27017/web_vidientu')


app.use(express.static(__dirname + '/public/style'))
app.use(express.static(__dirname + '/public/js'))
app.use(express.static(__dirname + '/public/img'))
app.use(session({
    secret: 'abc',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },

}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))




app.set('view engine', 'ejs');
app.set('views', __dirname + "/views")

app.use(function (req, res, next) {
    res.locals.flash = req.session.flash
    delete req.session.flash
    next()
})

// var authUserLogin=function (req,res,next){
//     if(req.session.userId){
//         next()
//     }
//     else{
//         req.session.flash = {
//             type: 'error',
//             message: 'Bạn cần phải đăng nhập trước khi sử dụng dịch vụ này'
//         }
//         res.redirect('/login')
//     }
// }

// var authUserAccount= async function(req,res,next){
//     var statusAcc = await user_account.findOne({username:req.session.userId})
//     if(statusAcc.trang_thai=='Chờ xác minh'){
//         req.session.flash = {
//             type: 'error',
//             message: 'Tính năng này chỉ dành cho các tài khoản đã được xác minh'
//         }
//         res.json('Sai')
//     }
//     if(statusAcc.trang_thai=='Đã xác minh'){
//         next()
//     }
// }

// app.get('/register', function (req, res) {
//     res.render('RegisterForm')
// })

// app.post('/register', async function (req, res) {
//     const form = new multiparty.Form()
  
//     form.parse(req, async (err, fields, files) => {
//         console.log(fields)
//         var findEmail = await user_account.findOne({email:fields.email[0]})
//         if(findEmail!=null){
//             req.session.flash = {
//                 type: 'error',
//                 message: 'Email này đã tồn tại'
//             }
//             res.redirect('/register')
//             return
//         }
//         var findSdt = await user_account.findOne({sdt:fields.phonenumber[0]})
//         if(findSdt!=null){
//             req.session.flash = {
//                 type: 'error',
//                 message: 'Số điện thoại này đã tồn tại'
//             }
//             res.redirect('/register')
//             return
//         }
//         var username_id = Math.floor(Math.random() * 10000000000)
//         var user_pass = Math.floor(Math.random() * 1000000)

//         if (err) return res.status(500).send(err.message)
//         var filename_truoc = files.cmndtruoc[0].originalFilename.split('.')
//         var filetype_truoc = filename_truoc[filename_truoc.length - 1]

//         var filename_sau = files.cmndsau[0].originalFilename.split('.')
//         var filetype_sau = filename_sau[filename_sau.length - 1]

//         var oldPath_truoc = files.cmndtruoc[0].path;

//         var filecmnd_truoc = shortid.generate() + '.' + filetype_truoc;
//         var filecmnd_sau = shortid.generate() + '.' + filetype_sau;
//         var newPath_truoc = '../source/public/img_cmnd/' + filecmnd_truoc
//         fs.rename(oldPath_truoc, newPath_truoc, function (err) {
//             if (err) throw err;
//             console.log('Successfully renamed - AKA moved!')
//         })

//         var oldPath_sau = files.cmndsau[0].path;
//         var newPath_sau = '../source/public/img_cmnd/' + filecmnd_sau
//         fs.rename(oldPath_sau, newPath_sau, function (err) {
//             if (err) throw err;
//             console.log('Successfully renamed - AKA moved!')
//         })
//         var date = new Date();
//         new user_account({
//             username: username_id,
//             password: user_pass,
//             email: fields.email[0],
//             ho_ten: fields.name[0],
//             ngay_sinh: fields.date[0],
//             dia_chi: fields.diachi[0],
//             sdt: fields.phonenumber[0],
//             trang_thai: "Chờ xác minh",
//             trang_thai_dangnhap: 0,
//             sl_nhap_sai: 0,
//             tinhtrang_doimk: 0,
//             ngay_tao: date,
//             cmnd_truoc: filecmnd_truoc,
//             cmnd_sau: filecmnd_sau

//         }).save();

//         sendmail(fields.email[0], username_id, user_pass)

//         // console.log('field data: ', fields)
//         // console.log('files: ', files)
//         res.redirect(303, '/login')
//     })

// })


//tách file
app.use('/register',registerRoute)


//tách file login
app.use('/login',loginRoute)


// app.get('/login', function (req, res) {
//     if(!req.session.userId)
//     res.render('LoginForm')
//     else
//     res.redirect('/')
// })

// app.post('/login', async function (req, res) {
//     var nhapsai = await user_account.findOne({ username: req.body.username })
//     if(nhapsai==null){
//         req.session.flash = {
//             type: 'error',
//             message: 'Sai tài khoản hoặc mật khẩu'
//         }
//         res.redirect('/login')
//         return
//     }
//     if(nhapsai.trang_thai_dangnhap==2){
//         req.session.flash = {
//             type: 'block',
//             message: 'Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ'
//         }
//         res.redirect('/login')
//         return
//     }
//     if (req.session.block == true && nhapsai!=null) {
//         req.session.flash = {
//             type: 'block',
//             message: 'Bạn đã nhập sai 3 lần, tài khoản của bạn bị tạm khóa 1 phút'
//         }
//         res.redirect('/login')
//         return
//     }
//     var find = await user_account.find({ $and: [{ username: req.body.username }, { password: req.body.password }] })
//     if (find.length != 0) {
//         if(find[0].trang_thai=='Đã vô hiệu hóa'){
//             req.session.flash = {
//                 type: 'block',
//                 message: 'Tài khoản này đã bị vô hiệu hóa, vui lòng liên hệ tổng đài 18001008'
//             }
//             res.redirect('/login')
//             return
//         }
//        //nhập đúng
//         req.session.userId = find[0].username
//         req.session.doi_mk = find[0].tinhtrang_doimk
//         req.session.nhap_sai = find[0].sl_nhap_sai
//         if (find[0].tinhtrang_doimk == 0) {
//             res.redirect('/changepassword')
//         }
//         else if (find[0].tinhtrang_doimk == 1) {
//             res.redirect('/')
//         }
//         await user_account.updateOne({ username: req.body.username }, { sl_nhap_sai: 0, trang_thai_dangnhap: 0 })
//     }
//     else {
       
//         if (nhapsai != null) {

//             if (nhapsai.sl_nhap_sai == 2) {
//                 req.session.flash = {
//                     type: 'block',
//                     message: 'Bạn đã nhập sai 3 lần, tài khoản của bạn bị tạm khóa 1 phút'
//                 }
//                 await user_account.updateOne({ username: req.body.username }, {sl_nhap_sai:nhapsai.sl_nhap_sai+1, trang_thai_dangnhap: nhapsai.trang_thai_dangnhap + 1 })
//                 req.session.block = true
//                 setTimeout( function () {
//                     req.session.destroy()
//                     console.log('delete success')
//                 }, 60000)
//                 res.redirect('/login')
//                 return
//             }
//             else if(nhapsai.sl_nhap_sai==5){
//                 await user_account.updateOne({ username: req.body.username }, {sl_nhap_sai:nhapsai.sl_nhap_sai+1, trang_thai_dangnhap: nhapsai.trang_thai_dangnhap + 1 })
//                 // res.redirect('/login')
//                 // return
//             }
//             else {
//                 await user_account.updateOne({ username: req.body.username }, { sl_nhap_sai: nhapsai.sl_nhap_sai + 1 })
//             }
//         }
//         req.session.flash = {
//             type: 'error',
//             intro: 'wrong pass or username',
//             message: 'Sai tài khoản hoặc mật khẩu'
//         }

//         res.redirect('/login')
//     }

// })

app.get('/',function(req,res){
    res.send('this is homepage')
})
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/')
})  

app.use('/changepassword',changepassRoute)

// app.get('/changepassword',authUserLogin,authUserAccount, function (req, res) {
//     if (req.session.userId && req.session.doi_mk == 0)
//         res.render('ChangePassword')
//     else if(req.session.userId && req.session.doi_mk == 1){
//         res.render('ChangePassword')
//     }
//     else
//         res.redirect('/login')
// })
// //đổi mật khẩu cho lần đầu đăng nhập
// app.post('/changepassword', async function (req, res) {
//     if (req.body.password1 == req.body.password2) {
//         await user_account.updateOne({ username: req.session.userId }, {
//             $set: {
//                 password: req.body.password1,
//                 tinhtrang_doimk: 1
//             }
//         })
//         res.redirect('/')
//     }
//     else {
//         req.session.flash = {
//             type: 'error',
//             message: 'Mật khẩu không trùng khớp'
//         }
//         res.redirect('/changepassword')
//     }
// })

// //đổi mật khẩu
// app.post('/changepassword2',async function(req,res){
//     var checkOldPass= await user_account.findOne({username:req.session.userId,password:req.body.oldPass})
//     if(!checkOldPass){
//         req.session.flash = {
//             type: 'error',
//             message: 'Sai mật khẩu '
//         }
//         res.redirect('/changepassword')
//     }
//     if(req.body.password1!=req.body.password2){
//         req.session.flash = {
//             type: 'error',
//             message: 'Mật khẩu không trùng khớp'
//         }
//         res.redirect('/changepassword')
//     }
//     checkOldPass.updateOne({password:req.body.password1})
//     res.redirect('/information')
// })



app.use('/information',informationRoute)

// app.get('/information',authUserLogin,authUserAccount,async function(req,res){
//     var infor = await user_account.findOne({username:req.session.userId})
//     res.json(infor)
//     // res.render('information')
// })



app.get('/admin',async function(req,res){
    var data= await user_account.find()
    res.render('admin',{result:data})
})


// app.get('/otpcode',function(req,res){
//     if(!req.session.userEmail){
//         res.redirect('/forgetpassword')
//     }
// })

app.use('/forgetpassword',forgetpassRoute)

app.use('/otpcode',checkOTP)
// app.post('/validemail',async function(req,res){
//     var checkemail=await user_account.findOne({email:req.body.email})
//     if(checkemail){
//         req.session.userEmail=req.body.email
//         res.json({code:0,message:'Email đúng'})
//     }
//     else{
//         res.json({code:1,message:'Email này chưa được sử dụng bởi bất cứ tài khoản nào'})
//     }
// })

// app.post('/submitotp',function(req,res){
//     if (req.body.otp ==req.session.otp){
//         res.redirect('/changepassword')}
// })

// async function sendmail(gmail_user, username_id, user_pass) {

//     const admingmail = process.env.EMAIL_ADMIN
//     const adminpass = process.env.PASS_EMAIL

//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: admingmail,
//             pass: adminpass
//         }
//     });


//     var mailOptions = {
//         from: 'trnnam481@gmail.com',
//         to: gmail_user,
//         subject: 'Thông tin đăng nhập ví điện tử',
//         text: `
//                 Username: ${username_id}
//                 Password: ${user_pass}
//                 Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi`
//     };

//     try {
//         await transporter.sendMail(mailOptions)
//         console.log("send success")
//     }
//     catch (err) {
//         console.log(err)
//     }
// }

app.use('/deposit',depositRoute)

app.use('/withdraw',withdrawRoute)

app.listen(3000, function () {
    console.log("Listening at port 3000")
})