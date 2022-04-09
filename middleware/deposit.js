var creditCard = require('../models/creditCard')
var moneyInAcc = require('../models/moneyInAccount')


function depositGET(req, res) {
    res.render('deposit')
}

async function depositPOST(req, res) {
    console.log(req.body)
    var creditNumber = req.body.creditNumber
    var CVV = req.body.CVV
    var validDate = req.body.validDate;
    var amount = parseInt(req.body.amount)

    var getCreditCard = await creditCard.findOne({ soThe: creditNumber, maCVV: CVV, ngayHetHan: validDate })

    var getMoneyUser = await moneyInAcc.findOne({ username: req.session.userId })
    console.log(getCreditCard)
    if (!getCreditCard) {

        if ((creditNumber == 111111 && CVV == '411') || (creditNumber == 222222 && CVV == '443') || (creditNumber == 333333 && CVV == '577')) {
            res.json({ message: "Sai ngày hết hạn " })
            return
        }
        if ((creditNumber == 111111 && validDate == '10-10-2022') || (creditNumber == 222222 && validDate == '11-11-2022') || (creditNumber == 333333 && validDate == '12-12-2022')) {
            res.json({ message: "Sai mã CVV" })
            return
        }
        if (creditNumber!=111111 && creditNumber!=222222 && creditNumber!=333333) {
            res.json({ message: "Thẻ không được hỗ trợ" })
            return
        }
        res.json({ message: "Mã CVV và ngày hết hạn không hợp lệ" })
        return
    }


    if (creditNumber == 111111 && getCreditCard) {
        await moneyInAcc.updateOne({ username: req.session.userId }, { amount: getMoneyUser.amount + amount })
        res.json({ message: "success" })
        return
    }
    if (creditNumber == 222222 && getCreditCard) {
        if (amount > 1000000 || amount < 0) {
            res.json({ message: "Số tiền nạp không hợp lệ" })
            return
        }
        else {
            await moneyInAcc.updateOne({ username: req.session.userId }, { amount: getMoneyUser.amount + amount })
            res.json({ message: "Success" })
            return
        }
    }
    if (creditNumber == 333333 && getCreditCard) {
        res.json({ message: "Thẻ hết tiền" })
        return
    }



}

module.exports = {
    depositGET,
    depositPOST
}