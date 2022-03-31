var mongoose = require('mongoose')

var CreditSchema=mongoose.Schema({
   soThe:String,
   ngayHetHat:Date,
   maCVV:String
})
var CreditModel=mongoose.model('CreditCard',CreditSchema)
module.exports=CreditModel;