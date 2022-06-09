var creditCard = require('../models/creditCard')
var moneyInAcc = require('../models/moneyInAccount')
var transactionHistory=require('../models/transactionHistory')
var depositHistory=require('../models/depositHistory')
var shortid =require('shortid')
var moment =require('moment')
function depositGET(req, res) {
    res.render('deposit_wallet')
}

async function depositPOST(req, res) {
    var creditNumber = req.body.creditNumber
    var CVV = req.body.CVV
    var validDate = req.body.validDate;
    var amount = parseInt(req.body.amount)
    var idDetail=shortid.generate()
    var currentDate = new Date(moment().format())
    //Kiểm tra ngày nhập có hợp lệ không
    if(!moment(validDate, "DD-MM-YYYY", true).isValid()){
        req.session.flash={
            message:'Ngày không hợp lệ'
        }
        res.redirect('/deposit')
        return
    }

    var getCreditCard = await creditCard.findOne({ soThe: creditNumber, maCVV: CVV, ngayHetHan: validDate })

    var getMoneyUser = await moneyInAcc.findOne({ username: req.session.userId })
    if (!getCreditCard) {

        if ((creditNumber == 111111 && CVV == '411') || (creditNumber == 222222 && CVV == '443') || (creditNumber == 333333 && CVV == '577')) {
            req.session.flash=({ message: "Sai ngày hết hạn " })
            res.redirect('/deposit')

            return
        }
        if ((creditNumber == 111111 && validDate == '10-10-2022') || (creditNumber == 222222 && validDate == '11-11-2022') || (creditNumber == 333333 && validDate == '12-12-2022')) {
            req.session.flash=({ message: "Sai mã CVV" })
            res.redirect('/deposit')

            return
        }
        if (creditNumber!=111111 && creditNumber!=222222 && creditNumber!=333333) {
            req.session.flash=({ message: "Thẻ không được hỗ trợ" })
            res.redirect('/deposit')

            return
        }
        req.session.flash=({ message: "Mã CVV và ngày hết hạn không hợp lệ" })
        res.redirect('/deposit')

        return
    }


    if (creditNumber == 111111 && getCreditCard) {
      
        await moneyInAcc.updateOne({ username: req.session.userId }, { amount: getMoneyUser.amount + amount })
        //lịch sử giao dịch
        new transactionHistory({
            username:req.session.userId,
            type:'Nạp tiền',
            createAt:currentDate,
            idDetail:idDetail
        }).save()
        //chi tiết lịch sử nạp
        new depositHistory({
            idDetail:idDetail,
            creditCard:creditNumber,
            amount:amount,
            state:'Thành công',
            createAt:currentDate
        }).save()
        req.session.flash=({ message: "success" })
        res.redirect('/deposit/result')
        return
    }
    if (creditNumber == 222222 && getCreditCard) {
        if (amount > 1000000 || amount < 0) {
            req.session.flash=({ message: "Số tiền nạp không hợp lệ" })
            res.redirect('/deposit')

            return
        }
        else {
            await moneyInAcc.updateOne({ username: req.session.userId }, { amount: getMoneyUser.amount + amount })
            new transactionHistory({
                username:req.session.userId,
                type:'Nạp tiền',
                createAt:currentDate,
                idDetail:idDetail
            }).save()
            //chi tiết lịch sử nạp
            new depositHistory({
                idDetail:idDetail,
                creditCard:creditNumber,
                amount:amount,
                state:'Thành công',
                createAt:currentDate
            }).save()
            req.session.flash=({ message: "Success" })
            res.redirect('/deposit/result')
            return
        }
    }
    if (creditNumber == 333333 && getCreditCard) {
        req.session.flash=({ message: "Thẻ hết tiền" })
        res.redirect('/deposit')

        return
    }
}

function depositResultGET(req,res){
    res.render('deposit_result')
}

module.exports = {
    depositGET,
    depositPOST,
    depositResultGET,
}