var router=require('express').Router()
var authLogin=require('../middleware/authLogin')
var confirmTransferMD=require('../middleware/confirmtrans')

router.get('/',authLogin,confirmTransferMD.confirmtransferGET)
router.get('/result',authLogin,confirmTransferMD.confirmtransferResult)
router.post('/',authLogin,confirmTransferMD.confirmtransferPOST)

module.exports=router