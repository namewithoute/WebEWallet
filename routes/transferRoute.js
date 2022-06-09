var transferMD=require('../middleware/transfer')
var authLogin=require('../middleware/authLogin')
var router=require('express').Router()

router.get('/',authLogin,transferMD.transferGET)
router.post('/',transferMD.transferPOST)
module.exports=router