var router=require('express').Router()
var updateStateMD= require('../middleware/updateStateAcc')

router.post('/',updateStateMD)


module.exports=router