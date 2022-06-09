var user_account = require('../models/userAccount')
var moneyOfUser = require('../models/moneyInAccount')
var transactionHistory = require('../models/transactionHistory')
var transferHistory = require('../models/transferHistory')
var sendEmailTransSuccess=require('../middleware/mailTransSuccess')
var shortid = require('shortid')
var moment = require('moment')
function confirmtransferGET(req, res) {
    res.render('confirmtransfer')
}

function confirmtransferResult(req, res) {
    res.render('transferResult')
}

async function confirmtransferPOST(req, res) {
    if (req.session.otp != req.body.otp) {
        req.session.flash = {
            message: 'Mã OTP không đúng'
        }
        res.redirect('/confirmtransfer')
        return
    }
    if (req.session.otp == req.body.otp) {
        //lấy người nhận và người chuyển
        var remitter = await moneyOfUser.findOne({ username: req.session.userId })
        var receiver = await moneyOfUser.findOne({ username: req.session.remitter })

        var receiverAccount = await user_account.findOne({username:req.session.remitter})
        var amount = parseInt(req.session.data.amount)
        var option = req.session.data.option
        var note = req.session.data.note
        var state
        if (amount > 5000000) {
            state = 'Đang chờ duyệt'
        }
        else {
            state = 'Chuyển thành công'
            sendEmailTransSuccess(receiverAccount.email,amount,receiverAccount.ho_ten,note)

            if (option == 'Người chuyển trả') {
                //update tài khoản chuyển
                await moneyOfUser.updateOne({ username: req.session.userId }, { amount: remitter.amount - (amount * 1.05) })
                //update tài khoản nhận
                await moneyOfUser.updateOne({ username: receiver.username }, { amount: receiver.amount + (amount) })
    
            }
            else if (option == 'Người nhận trả') {
                //update tài khoản chuyển
                await moneyOfUser.updateOne({ username: req.session.userId }, { amount: remitter.amount - (amount) })
                //update tài khoản nhận
                await moneyOfUser.updateOne({ username: receiver.username }, { amount: receiver.amount + (amount * 0.95) })
            }

        }
   
        var currentDate = new Date(moment().format())
        var iddetail = shortid.generate()
        //tạo lịch sử giao dịch
        new transactionHistory({
            username: req.session.userId,
            type: 'Chuyển tiền',
            createAt: currentDate,
            idDetail: iddetail
        }).save()
        new transferHistory({
            idDetail: iddetail,
            userReceiver: receiver.username,
            amount: amount,
            fees:amount*0.05,
            note: note,
            state: state,
            feeBearer: option,
            createAt: currentDate
        }).save()
        req.session.flash = { message: state }
        res.redirect('/confirmtransfer/result')
    }

}

module.exports = {
    confirmtransferGET,
    confirmtransferPOST,
    confirmtransferResult
}