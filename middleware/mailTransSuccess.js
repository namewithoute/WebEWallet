var nodemailer=require('nodemailer')

async function sendmail(gmail_user, amount ,name , note) {

    const admingmail = process.env.EMAIL_ADMIN
    const adminpass = process.env.PASS_EMAIL

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: admingmail,
            pass: adminpass
        }
    });

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
    });

    var afterFormat = formatter.format(amount);
    var mailOptions = {
        from: 'trnnam481@gmail.com',
        to: gmail_user,
        subject: 'BIẾN ĐỘNG SỐ DƯ',
        text: `
                Tài khoản của bạn vừa được nạp: ${afterFormat}đ từ người dùng ${name}
                Ghi chú:${note} `
    };

    try {
        await transporter.sendMail(mailOptions)
        console.log("send success")
    }
    catch (err) {
        console.log(err)
    }
}

module.exports=sendmail