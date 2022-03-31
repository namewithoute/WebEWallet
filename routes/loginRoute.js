var route= require('express').Router()
var loginMiddleware =require('../middleware/login')

route.get('/',loginMiddleware.loginGet)
route.post('/',loginMiddleware.loginPost)

module.exports=route