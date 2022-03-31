var nodemailer=require('nodemailer')

async function sendmail(gmail_user, username_id, user_pass) {

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
        subject: 'Thông tin đăng nhập ví điện tử',
        text: `
                Username: ${username_id}
                Password: ${user_pass}
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi`
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