var user_account = require('../models/userAccount')
var moment = require('moment')

var history_transaction = require('../models/transactionHistory')
var history_withraw = require('../models/withdrawHistory')
var transfer_history = require('../models/transferHistory')
var deposit_history=require('../models/depositHistory')
const { response } = require('express')
async function adminHomeGET(req, res) {
    var data = await user_account.find()
    var newdata = []
    data.forEach((user) => {

        newdata.push({
            username: user.username,
            email: user.email,
            ngay_tao: moment(user.ngay_tao).format('L'),
            ngay_capnhat: moment(user.ngay_capnhat).format('L'),
            trang_thai: user.trang_thai
        })
    })
    console.log(newdata)
    res.render('admin', { result: newdata })
}

async function getOneUser(req,res){
    var user =await user_account.findOne({username:req.params.id})
    var chitiet=''
    if(user.sl_nhap_sai>0 && user.trang_thai!='Đã vô hiệu hóa'){
        chitiet='Đăng nhập bất thường'
    }else if(user.trang_thai=='Bị khóa vô thời hạn'){
        chitiet='Bị khóa do nhập sai mật khẩu nhiều lần'
    }
    else if(user.trang_thai=='Đã vô hiệu hóa'){
        chitiet='Không chấp nhận tài khoản'
    }
    console.log(chitiet)

    var newdata={
        username: user.username,
        email: user.email,
        ngay_tao: moment(user.ngay_tao).format('L'),
        sdt:user.sdt,
        ho_ten:user.ho_ten,
        ngay_capnhat: moment(user.ngay_capnhat).format('L'),
        trang_thai: user.trang_thai,
        cmnd_truoc:user.cmnd_truoc,
        cmnd_sau:user.cmnd_sau,
        doi_mk:user.tinhtrang_doimk,
        dangnhap_batthuong:user.trang_thai_dangnhap,
        chitiet:chitiet
    }
 

    res.render('Information_userForAdmin',{result:newdata})
}

async function adminWaitActiveGET(req, res) {
    var data = await user_account.find({ trang_thai: 'Chờ xác minh' }).sort({
        ngay_tao: -1,
        ngay_capnhat: -1
    })
    var newdata = []
    data.forEach((user) => {
        newdata.push({
            username: user.username,
            email: user.email,
            ngay_tao: moment(user.ngay_tao).format('L'),
            ngay_capnhat: moment(user.ngay_capnhat).format('L'),
            trang_thai: user.trang_thai
        })
    })
    console.log(newdata)
    res.render('admin', { result: newdata })
}

async function adminActiveGET(req, res) {
    var data = await user_account.find({ trang_thai: 'Đã xác minh' }).sort({
        ngay_tao: -1,
    })
    var newdata = []
    data.forEach((user) => {
        newdata.push({
            username: user.username,
            email: user.email,
            ngay_tao: moment(user.ngay_tao).format('L'),
            ngay_capnhat: moment(user.ngay_capnhat).format('L'),
            trang_thai: user.trang_thai
        })
    })
    console.log(newdata)
    res.render('admin', { result: newdata })
}

async function adminLockGET(req, res) {
    var data = await user_account.find({ trang_thai: 'Bị khóa vô thời hạn' }).sort({
        ngay_tao: -1,
    })
    var newdata = []
    data.forEach((user) => {
        newdata.push({
            username: user.username,
            email: user.email,
            ngay_tao: moment(user.ngay_tao).format('L'),
            ngay_capnhat: moment(user.ngay_capnhat).format('L'),
            trang_thai: user.trang_thai
        })
    })
    console.log(newdata)
    res.render('admin', { result: newdata })
}

async function adminDisableGET(req,res){
    var data = await user_account.find({ trang_thai: 'Đã vô hiệu hóa' }).sort({
        ngay_tao: -1,
    })
    var newdata = []
    data.forEach((user) => {
        newdata.push({
            username: user.username,
            email: user.email,
            ngay_tao: moment(user.ngay_tao).format('L'),
            ngay_capnhat: moment(user.ngay_capnhat).format('L'),
            trang_thai: user.trang_thai
        })
    })
    console.log(newdata)
    res.render('admin', { result: newdata })

}

async function adminHTrsPendingGET(req, res) {
    var data = await history_transaction.find().sort({ createAt: -1 })
    var newdata = []
    for (var i = 0; i < data.length; i++) {
        if (data[i].type == 'Rút tiền') {
            var withdrawPeding = await history_withraw.findOne({ state: "Đang chờ duyệt", idDetail: data[i].idDetail })
            if (withdrawPeding) {
                newdata.push({
                    idDetail: data[i].idDetail,
                    createAt: moment(data[i]).format('LLL'),
                    username: data[i].username,
                    state: "ĐANG CHỜ DUYỆT",
                    type: "RÚT TIỀN"
                })
            }
        }
        else if (data[i].type == 'Chuyển tiền') {
            var transferPending = await transfer_history.findOne({ state: "Đang chờ duyệt", idDetail: data[i].idDetail })
            if (transferPending) {
                newdata.push({
                    idDetail: data[i].idDetail,
                    createAt: moment(data[i]).format('LLL'),
                    username: data[i].username,
                    state: "ĐANG CHỜ DUYỆT",
                    type: "CHUYỂN TIỀN"
                })
            }
        }
        // thao tác cho chuyển tiền
    }
    res.render('admin', { transaction: newdata })
}

async function adminHTrsSuccessGET(req, res) {
    var data = await history_transaction.find().sort({ createAt: -1 })
    var newdata = []
    for (var i = 0; i < data.length; i++) {
        if (data[i].type == 'Rút tiền') {

            var withdrawSuccess = await history_withraw.findOne({ state: "Chuyển thành công", idDetail: data[i].idDetail })
            if (withdrawSuccess) {
                newdata.push({
                    idDetail: data[i].idDetail,
                    createAt: moment(data[i].createAt).format('LLL'),
                    username: data[i].username,
                    state: "THÀNH CÔNG",
                    type: 'RÚT TIỀN'
                })
            }
        }
        else if(data[i].type=='Chuyển tiền'){
            var transferSuccess = await transfer_history.findOne({ state: "Chuyển thành công", idDetail: data[i].idDetail })

            if (transferSuccess) {
                newdata.push({
                    idDetail: data[i].idDetail,
                    createAt: moment(data[i].createAt).format('LLL'),
                    username: data[i].username,
                    state: "THÀNH CÔNG",
                    type: 'CHUYỂN TIỀN'
                })
            }
        }
        console.log()

        //thao tác cho chuyển tiền
    }
    res.render('admin', { transaction: newdata })
}

async function adminHTrsAllGET(req, res) {
    var data = await history_transaction.find({}).sort({ createAt: -1 })
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
    //thao tác với chuyển tiền
    console.log(newdata)

    res.render('admin', { transaction: newdata })
}

async function adminHTrsDetailGET(req,res){
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
    res.render('transaction_history_admin',{data:data})
}

module.exports = {
    adminHomeGET,
    adminWaitActiveGET,
    adminActiveGET,
    adminLockGET,
    adminHTrsPendingGET,
    adminHTrsSuccessGET,
    adminHTrsAllGET,
    adminHTrsDetailGET,getOneUser,adminDisableGET
}