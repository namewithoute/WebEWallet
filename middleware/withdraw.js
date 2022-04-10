var transactionHistory = require('../models/transactionHistory')
var withdrawHistory = require('../models/withdrawHistory')
var moneyInAcc = require('../models/moneyInAccount')
var moment = require('moment')
var shortid = require('shortid')
function withdrawGET(req, res) {
    res.render('withdraw')
}

async function withdrawPOST(req, res) {
    var idDetail = shortid.generate()
    var creditNumber = req.body.creditNumber
    var validDate = req.body.validDate
    var CVV = req.body.CVV
    var note = req.body.note
    var amount = parseInt(req.body.amount)
    if(isNaN(amount)){
        res.json({message:"Error"})
        return
    }
    if(amount%50000!=0){
        res.json({message:"Số tiền nhập phải là bội của 50.000đ"})
        return
    }
    amount=amount*1.05
    var withdrawPerDay = await transactionHistory.find({ username: req.session.userId })
    //lấy ngày hiện tại
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    //

    var newAr = withdrawPerDay.filter(withdraw =>
        moment(withdraw.createAt).format('L') == today && withdraw.type == "Rút tiền"
    )
    var state
    if (newAr.length < 2) {

        //Kiểm tra số dư có hợp lệ không        
        var money = await moneyInAcc.findOne({ username: req.session.userId })
        if (amount > money.amount) {
            res.json({ message: "Số tiền bạn muốn rút vượt quá số dư bạn đang có" })
            return
        }

        var currentDate = new Date(moment().format())
        if (amount > 5000000) {
            state = "Đang chờ duyệt"
        }
        else {
            state = "Chuyển thành công"
            await moneyInAcc.updateOne({ username: req.session.userId }, { amount: money.amount - amount })
        }
        new transactionHistory({
            username: req.session.userId,
            type: "Rút tiền",
            createAt: currentDate,
            idDetail: idDetail,
        }).save()

        new withdrawHistory({
            idDetail: idDetail,
            creditCard: creditNumber,
            amount: amount,
            note: note,
            state: state,
            createAt: currentDate
        }).save()

     
        res.json({ message: state })
        return
    }
    else if (newAr.length == 2) {
        res.json({ message: "Bạn đã rút hết lượt của ngày hôm nay" })
    }
}

module.exports = {
    withdrawGET,
    withdrawPOST
}