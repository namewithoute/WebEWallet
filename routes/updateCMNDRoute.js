var router=require('express').Router()

var updateCMND_MD=require('../middleware/updateCMND')

router.post('/',updateCMND_MD)

module.exports=router