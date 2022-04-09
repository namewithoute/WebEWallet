var router=require('express').Router()
var depositMiddleware=require('../middleware/deposit')
var authLogin=require('../middleware/authLogin')
router.get('/',authLogin,depositMiddleware.depositGET)
router.post('/',authLogin,depositMiddleware.depositPOST)

module.exports=router