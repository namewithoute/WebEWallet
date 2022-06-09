var getNameTransMD=require('../middleware/getNameTransfer')
var route=require('express').Router()

route.post('/',getNameTransMD)
module.exports=route