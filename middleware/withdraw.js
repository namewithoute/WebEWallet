var transactionHistory = require('../models/transactionHistory')
var withdrawHistory = require('../models/withdrawHistory')
var moneyInAcc = require('../models/moneyInAccount')
var creditCard=require('../models/creditCard')
var moment = require('moment')
var shortid = require('shortid')
function withdrawGET(req, res) {
    res.render('withdraw_money')
}

async function withdrawPOST(req, res) {
    var idDetail = shortid.generate()
    var creditNumber = req.body.creditNumber
    var validDate = req.body.validDate
    var CVV = req.body.CVV
    var note = req.body.note
    var amount = parseInt(req.body.amount)
    console.log(amount)
    if(!moment(validDate, "DD-MM-YYYY", true).isValid()){
        req.session.flash={
            message:'Ngày không hợp lệ'
        }
        res.redirect('/withdraw')
        return
    }
    var findCreditCard= await creditCard.findOne({soThe:creditNumber,maCVV:CVV,ngayHetHan:validDate})

    //kiểm tra thẻ có hợp lệ không
    if(creditNumber!='111111' && findCreditCard){
        req.session.flash={message:"Thẻ này không được hỗ trợ để rút tiền"}
        res.redirect('/withdraw')
        return
    }
    if(creditNumber=='111111'&& !findCreditCard){
        req.session.flash={message:"Sai thông tin thẻ"}
        res.redirect('/withdraw')

        return
    }
    if(creditNumber!='111111'&& !findCreditCard){
        req.session.flash={message:"Thẻ không hợp lệ"}
        res.redirect('/withdraw')

        return
    }
  
    //kiểm tra số tiền rút có là bội của 50000
    if(amount%50000!=0){
        req.session.flash=({message:"Số tiền nhập phải là bội của 50.000đ"})
        res.redirect('/withdraw')

        return
    }

    var newamount=amount*1.05
    
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
            req.session.flash=({ message: "Số tiền bạn muốn rút vượt quá số dư bạn đang có" })
            res.redirect('/withdraw')

            return
        }

        var currentDate = new Date(moment().format())
        if (amount > 5000000) {
            state = "Đang chờ duyệt"
        }
        else {
            state = "Chuyển thành công"
            await moneyInAcc.updateOne({ username: req.session.userId }, { amount: money.amount - newamount })
        }
        //lưu lịch sử giao dịch
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
            fees:amount*0.05,
            note: note,
            state: state,
            createAt: currentDate
        }).save()
        req.session.flash={message:state}
        res.redirect('/withdraw/result')
        return
    }
    else if (newAr.length == 2) {
       req.session.flash={ message: "Bạn đã rút hết lượt của ngày hôm nay" }
       res.redirect('/withdraw')
        return
    }
}

function withdrawResultGET(req,res){
    res.render('withdrawmoney_result')
}

module.exports = {
    withdrawGET,
    withdrawPOST,
    withdrawResultGET
}