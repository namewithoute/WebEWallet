var nodemailer=require('nodemailer')

async function sendmail(gmail_user, otp) {

    const admingmail = process.env.EMAIL_ADMIN
    const adminpass = process.env.PASS_EMAIL

    var transporter = nodemailer.createTransport({
        host:"mail.phongdaotao.com",
        port:25,
        secure:false,
        auth: {
            user: admingmail,
            pass: adminpass
        },
        tls: {rejectUnauthorized: false}
      
    });


    var mailOptions = {
        from: admingmail,
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
    console.log(otp)

}

module.exports=sendmail