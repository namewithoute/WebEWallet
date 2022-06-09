var router=require('express').Router()

var confirmTransactionAdmin=require('../middleware/confirmTransaction_Admin')

router.post('/',confirmTransactionAdmin)
module.exports=router