var nodemailer = require('nodemailer');

/**
 var mailOptions = {
    from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
 };

 user: 'kdcmobility@gmail.com',  // Your email id
 pass: 'Kdcmobile'               // Your password

//*/

exports.sendEmail = function(mailOptions) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'estta39@gmail.com',
            pass: 'qwe123qwe'
        }
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log("[ERROR Sending Email ]" + error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
};
