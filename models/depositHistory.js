var mongoose = require('mongoose')

var depositHisSchema=mongoose.Schema({
    idDetail:String,
    creditCard:String,
    amount:Number,
    state:String,
    createAt:Date,


})
var depositModel=mongoose.model('deposit_history',depositHisSchema)
module.exports=depositModel;