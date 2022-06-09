var user_account=require('../models/userAccount')
var moneyInAcc=require('../models/moneyInAccount')
module.exports=async function(req,res){
    var data
    var amount
    if(req.session.userId){
        data=await user_account.findOne({username:req.session.userId})
        amount=await moneyInAcc.findOne({username:req.session.userId})
        res.render('HomeUser',{data:{name:data.ho_ten,amount:amount.amount}})
        return
    }
    else
    res.render('HomeUser',data)
}