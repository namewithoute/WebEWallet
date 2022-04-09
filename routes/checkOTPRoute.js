var router=require('express').Router()

var checkotp=require('../middleware/checkotp')

router.get('/',checkotp.checkOTPGET)
router.post('/',checkotp.checkotpPOST)

module.exports=router