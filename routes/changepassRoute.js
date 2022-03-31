var route=require('express').Router()
var changepassMiddleWare = require('../middleware/changePass')
var authUserLogin=require('../middleware/authLogin')
var authUserAccount=require('../middleware/authUserAccount')


route.get('/',authUserLogin,authUserAccount,changepassMiddleWare.changepassGET)
route.post('/',changepassMiddleWare.changePass1POST)

//route đổi mật khẩu không phải lần đầu
route.post('/2',changepassMiddleWare.changePass2POST)

module.exports=route