const nodemailer = require('nodemailer');

const sendMail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    await transporter.sendMail({
        from: `Advance MERN Authentication ${process.env.EMAIL_PASS}`,
        to,
        subject,
        html
    })
}

module.exports = sendMail;