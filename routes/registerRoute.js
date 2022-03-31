var route= require('express').Router()
var registerMiddleWare = require('../middleware/register')
route.get('/',registerMiddleWare.getRegister)
route.post('/',registerMiddleWare.postRegister)

module.exports=route