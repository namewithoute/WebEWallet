var router=require('express').Router()

var forgetpasswordMiddleware=require('../middleware/forgetpass')

router.get('/',forgetpasswordMiddleware.forgetpassGET)
router.post('/',forgetpasswordMiddleware.forgetpassPOST)

module.exports=router
