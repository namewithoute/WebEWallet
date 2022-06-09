var nodemailer=require('nodemailer');
const nodemon = require('nodemon');

async function sendmail(gmail_user, username_id, user_pass) {

    const admingmail = process.env.EMAIL_ADMIN
    const adminpass = process.env.PASS_EMAIL

    var transporter = nodemailer.createTransport({
        // service: 'gmail',
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
    console.log(username_id, user_pass)

}

module.exports=sendmail