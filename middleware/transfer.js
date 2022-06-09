var user_account = require('../models/userAccount')
var moneyInAcc = require('../models/moneyInAccount')
var sendTransferOTP=require('../middleware/transferOTP')
function transferGET(req, res) {
    res.render('transfer')
}
async function transferPOST(req, res) {
    console.log(req.body)
    var amountTrans = req.body.amount
    var user = await user_account.findOne({ sdt: req.body.sdt })
    if (!user) {
        req.session.flash = {
            message: 'Số điện thoại không tồn tại'
        }
        res.redirect('/transfer')
        return
    }
    if(user.username==req.session.userId){
        req.session.flash = {
            message: 'Không thể tự chuyển cho chính mình'
        }
        res.redirect('/transfer')
        return
    }

    if(user){
        var moneyOfUser = await moneyInAcc.findOne({ username: req.session.userId })
        var remitter = await user_account.findOne({ username: req.session.userId })
   

        if (moneyOfUser.amount < ((amountTrans) * 1.05)) {
            req.session.flash = {
                message: 'Số dư không đủ'
            }
            res.redirect('/transfer')
            return
        }
        var otp = Math.floor(Math.random() * 1000000)
        console.log(otp)
        req.session.remitter=user.username
        req.session.otp=otp
        req.session.data=req.body
        sendTransferOTP(remitter.email,otp)
        setTimeout(function(){
            console.log(req.session.otp)
            delete req.session.otp
            // req.session.destroy()
            console.log('delete session success')
            console.log(req.session.otp)
        },60000)
        res.redirect('/confirmtransfer')
    }    

}



module.exports = {
    transferGET,
    transferPOST
}


