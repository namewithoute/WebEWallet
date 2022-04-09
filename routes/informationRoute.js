var router=require('express').Router()
var informationMiddleware = require('../middleware/information')
var authUserLogin=require('../middleware/authLogin')
var authUserAccount = require('../middleware/authUserAccount')

router.get('/',authUserLogin,authUserAccount,informationMiddleware)

module.exports=router