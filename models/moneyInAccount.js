var mongoose = require('mongoose')

var moneyInAccSchema=mongoose.Schema({
   username:String,
   amount:Number,
})
var CreditModel=mongoose.model('MoneyInAccount',moneyInAccSchema)
module.exports=CreditModel;