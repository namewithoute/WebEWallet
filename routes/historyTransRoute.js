var router=require('express').Router()
var transactionMD=require('../middleware/transactionHistory')
var checkLogin = require('../middleware/authLogin')
router.get('/',checkLogin,transactionMD.histroyTransactionGET)
router.get('/:id',checkLogin,transactionMD.historyDetail)
module.exports=router