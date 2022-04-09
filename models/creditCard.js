var mongoose = require('mongoose')

var CreditSchema=mongoose.Schema({
   soThe:String,
   ngayHetHan:String,
   maCVV:String
})
var CreditModel=mongoose.model('CreditCard',CreditSchema)
module.exports=CreditModel;