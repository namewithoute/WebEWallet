var mongoose=require('mongoose')

var adminAccountSchema= mongoose.Schema({
    username:String,
    password:String
})

var model = mongoose.model('admin_account',adminAccountSchema)
module.exports=model;