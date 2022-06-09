var mongoose = require('mongoose')

var withdrawHistorySchema=mongoose.Schema({
    idDetail:String,
    creditCard:String,
    amount:Number,
    fees:Number,
    note:String,
    state:String,
    createAt:Date,


})
var withdrawHistory=mongoose.model('withdraw_history',withdrawHistorySchema)
module.exports=withdrawHistory;