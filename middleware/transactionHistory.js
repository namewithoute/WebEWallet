var history_transaction=require('../models/transactionHistory')
var history_withraw = require('../models/withdrawHistory')
var transfer_history = require('../models/transferHistory')
var deposit_history=require('../models/depositHistory')
var moment=require('moment')

async function histroyTransactionGET(req,res){
    var data = await history_transaction.find({username:req.session.userId}).sort({ createAt: -1 })
    var newdata = []

    for (var i = 0; i < data.length; i++) {
        var date=new Date(data[i].createAt)

        console.log(date)

        if (data[i].type == 'Rút tiền') {
            var withdraw = await history_withraw.findOne({ idDetail: data[i].idDetail })
            if (withdraw) {
                newdata.push({
                    idDetail: data[i].idDetail,
                    createAt: moment(data[i].createAt).format('LLL'),
                    username: data[i].username,
                    state: withdraw.state,
                    type: data[i].type,
                })
            }

        }
    
    else if (data[i].type == 'Chuyển tiền') {

        var transfer = await transfer_history.findOne({ idDetail: data[i].idDetail })
        if (transfer) {
            newdata.push({
                idDetail: data[i].idDetail,
                createAt: moment(data[i].createAt).format('LLL'),
                username: data[i].username,
                state: transfer.state,
                type: data[i].type,
            })
        }
    }
    else if(data[i].type=='Nạp tiền'){
        var deposit = await deposit_history.findOne({ idDetail: data[i].idDetail })
        if (deposit) {
            newdata.push({
                idDetail: data[i].idDetail,
                createAt: moment(data[i].createAt).format('LLL'),
                username: data[i].username,
                state: deposit.state,
                type: data[i].type,
            })
        }
    }
}
    console.log(newdata)
    res.render('transaction_history_user', { result: newdata })
}


async function historyDetail(req,res){
    var trans=await history_transaction.findOne({idDetail:req.params.id})
    var detail,data
    console.log(trans.type)
    if(trans.type=='Rút tiền'){
        detail= await history_withraw.findOne({idDetail:req.params.id})
        data={
            idDetail:trans.idDetail,
            username:trans.username,
            type:trans.type,
            creditCard:detail.creditCard,
            amount:detail.amount,
            fees:detail.fees,
            state:detail.state,
            note:detail.note,
            createAt:detail.createAt
        }
    }
    else if (trans.type=='Chuyển tiền'){
        detail = await transfer_history.findOne({idDetail:req.params.id})
        data={
            idDetail:trans.idDetail,
            username:trans.username,
            receiver:detail.userReceiver,
            type:trans.type,
            amount:detail.amount,
            fees:detail.fees,
            feeBearer:detail.feeBearer,
            state:detail.state,
            note:detail.note,
            createAt:detail.createAt
        }
    }
    else if(trans.type=='Nạp tiền'){
        detail = await deposit_history.findOne({idDetail:req.params.id})
        data={
            idDetail:trans.idDetail,
            username:trans.username,
            type:trans.type,
            creditCard:detail.creditCard,
            amount:detail.amount,
            state:detail.state,
            createAt:detail.createAt
        }
    }
    console.log(data)
    res.render('transaction_history_detail_user',{data:data})
}

module.exports={
    histroyTransactionGET,
    historyDetail
}