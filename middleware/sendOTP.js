var nodemailer=require('nodemailer')

async function sendmail(gmail_user, otp) {

    const admingmail = process.env.EMAIL_ADMIN
    const adminpass = process.env.PASS_EMAIL

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: admingmail,
            pass: adminpass
        }
    });


    var mailOptions = {
        from: 'trnnam481@gmail.com',
        to: gmail_user,
        subject: 'Khôi phục mật khẩu',
        text: `
                Mã OTP của bạn là : ${otp}`
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