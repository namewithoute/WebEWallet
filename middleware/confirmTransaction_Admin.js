var history_transaction=require('../models/transactionHistory')
var user=require('../models/userAccount')
var transfer_history=require('../models/transferHistory')
var moneyInAcc=require('../models/moneyInAccount')
var withdraw=require('../models/withdrawHistory')
var mailTransSuccess=require('./mailTransSuccess')
async function confirm(req,res){
    console.log(req.body)
    var findUser= user.findOne({username:req.body.username})
    if(req.body.type=='Chuyển tiền'){
        var amountSend = await moneyInAcc.findOne({username:req.body.username})
        var amountReceiver= await moneyInAcc.findOne({username:req.body.receiver})
        if(req.body.feeBearer=='Người nhận trả'){
            await moneyInAcc.updateOne({username:req.body.receiver},{amount:amountReceiver.amount + parseInt(req.body.amount)*0.95})
            await moneyInAcc.updateOne({username:req.body.username},{amount:amountSend.amount - parseInt(req.body.amount)})
        }
        else if(req.body.feeBearer=='Người chuyển trả'){
            await moneyInAcc.updateOne({username:req.body.receiver},{amount:amountReceiver.amount + parseInt(req.body.amount)})
            await moneyInAcc.updateOne({username:req.body.username},{amount:amountSend.amount - parseInt(req.body.amount)*1.05})
        }
        await transfer_history.updateOne({idDetail:req.body.idDetail},{state:'Chuyển thành công'})
        await history_transaction.updateOne({idDetail:req.body.idDetail},{state:'Chuyển thành công'})
        mailTransSuccess(findUser.email,req.body.amount,findUser.ho_ten,req.body.note)
        res.json({code:1})
        return
    }
    else if(req.body.type=='Rút tiền'){
        var amountUser = await moneyInAcc.findOne({username:req.body.username})

        await moneyInAcc.updateOne({username:req.body.username},{amount:amountUser.amount - parseInt(req.body.amount)*1.05})
        await withdraw.updateOne({idDetail:req.body.idDetail},{state:'Rút thành công'})
        res.json({code:1})
        return

    }
    
}

module.exports=confirm