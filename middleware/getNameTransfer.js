var user_account = require('../models/userAccount')

async function getNameTransfer(req, res) {
    var sdt = req.body.sdt;
    var user = await user_account.findOne({ sdt: sdt })

    if (user) {
        console.log(user.username==req.session.userId)
        
        if (user.username == req.session.userId) {
            res.json({
                err: 'Không thể tự chuyển cho chính mình'
            })
            return
        }
        res.json({ nameUser: user.ho_ten })
        return
    }
    if (!user) {
        res.json({ err: 'Số điện thoại không tồn tại' })
    }
 

}
module.exports = getNameTransfer