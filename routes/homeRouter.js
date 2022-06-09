var homeMD=require('../middleware/homepage')
var router=require('express').Router()

router.get('/',homeMD)

module.exports=router