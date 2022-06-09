const { update } = require('../models/userAccount')
var user_account=require('../models/userAccount')
var fs=require('fs')
var shortid=require('shortid')
var multiparty = require('multiparty')


async function updateCMND(req,res){
     var form= new multiparty.Form()
     form.parse(req,async (err,fields,files)=>{
        var filename_truoc = files.cmnd_truoc[0].originalFilename.split('.')
        var filetype_truoc = filename_truoc[filename_truoc.length - 1]

        var filename_sau = files.cmnd_sau[0].originalFilename.split('.')
        var filetype_sau = filename_sau[filename_sau.length - 1]

        var oldPath_truoc = files.cmnd_truoc[0].path;

        var filecmnd_truoc = shortid.generate() + '.' + filetype_truoc;
        var filecmnd_sau = shortid.generate() + '.' + filetype_sau;
        var newPath_truoc = '../source/public/img_cmnd/' + filecmnd_truoc
        fs.rename(oldPath_truoc, newPath_truoc, function (err) {
            if (err) throw err;
            console.log('Successfully renamed - AKA moved!')
        })

        var oldPath_sau = files.cmnd_sau[0].path;
        var newPath_sau = '../source/public/img_cmnd/' + filecmnd_sau
        fs.rename(oldPath_sau, newPath_sau, function (err) {
            if (err) throw err;
            console.log('Successfully renamed - AKA moved!')
        })
        var date = new Date();

        await user_account.updateOne({username:req.session.userId},{cmnd_truoc:filecmnd_truoc,cmnd_sau:filecmnd_sau,ngay_capnhat:date,trang_thai:'Chờ xác minh'})
        req.session.flash={
            message:'Cập nhật thành công'
        }
        res.redirect('/information')
    })
}

module.exports=updateCMND