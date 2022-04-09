var user_account=require('../models/userAccount')
module.exports=async function(req,res){
    var infor = await user_account.findOne({username:req.session.userId})
    res.json(infor)
    // res.render('information')
}