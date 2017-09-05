'use strict';

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.FITNESS_TRACKER_EMAIL,
        pass: process.env.FITNESS_TRACKER_MAIL_PASSWORD
    }
});

exports.send_mail = (email, jwt) => {

    let mailOptions = {
        from: '"Fitness Tracker Admin" <fitness.tracker.mailer@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Fitness Tracker Registration', // Subject line
        html: `<h3>Thank you for signing-up, please follow the link to complete registration.</h3>
                <a href="http://127.0.0.1:8080/registration/${jwt}">Link</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};
