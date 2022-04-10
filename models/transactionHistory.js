var mongoose = require('mongoose')

var transactionHistorySchema=mongoose.Schema({
    username:String,
    type:String,
    createAt:Date,
    idDetail:String,

})
var trxHistoryModel=mongoose.model('transaction_history',transactionHistorySchema)
module.exports=trxHistoryModel;