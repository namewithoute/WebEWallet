var router=require('express').Router()
var authLogin=require('../middleware/authLogin')
var withdrawMD= require('../middleware/withdraw')

router.get('/',authLogin,withdrawMD.withdrawGET)
router.get('/result',authLogin,withdrawMD.withdrawResultGET)

router.post('/',withdrawMD.withdrawPOST)

module.exports=router