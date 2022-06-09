var mongoose=require('mongoose')

var transferShema=mongoose.Schema({
    idDetail:String,
    userReceiver:String,
    amount:Number,
    fees:Number,
    note:String,
    state:String,
    feeBearer:String,
    createAt:Date
})

var transferModel=mongoose.model('transferHistory',transferShema)
module.exports=transferModel