var router=require('express').Router()

var withdrawMD= require('../middleware/withdraw')

router.get('/',withdrawMD.withdrawGET)
router.post('/',withdrawMD.withdrawPOST)

module.exports=router