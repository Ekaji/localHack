const crypto = require('crypto');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const querystring = require('querystring');
const https = require('https');


//random codes
exports.genRandom = (howMany, chars) => {
    chars = chars || "ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    let rnd = crypto.randomBytes(howMany), value = new Array(howMany), len = chars.length;

    for (let i = 0; i < howMany; i++) {
        value[i] = chars[rnd[i] % len]
    };
    return value.join('');
};

exports.SMSHelper = (name, number, tempID) => {

    let rawNumber = number.slice(1);
    let convNum = `+234${rawNumber}`

    // sending sms for confirmation
    let username = process.env.SMSUSERNAME;
    let api = process.env.SMSAPI;
    let msg = `Hello ${name} \n Your registration as a member of ADP was successful your membership ID is: ${tempID}. \n#TheCredibleAlternative \nThank You \nOne Destiny`;

    
    let post_data = querystring.stringify({
        'username': username,
        'to': convNum,
        'message': msg
    });

    let post_options = {
        host: 'api.africastalking.com',
        path: '/version1/messaging',
        method: 'POST',

        rejectUnauthorized: false,
        requestCert: true,
        agent: false,

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length,
            'Accept': 'application/json',
            'apikey': api
        }
    };

    let post_req = https.request(post_options,  (res) => {
        res.setEncoding('utf8');
        res.on('data',  (chunk) => {
            let jsObject = JSON.parse(chunk);
            let recipients = jsObject.SMSMessageData.Recipients;


            if (recipients.length > 0) {
                for (let i = 0; i < recipients.length; ++i) {
                    let logStr = 'number=' + recipients[i].number;
                    logStr += ';cost=' + recipients[i].cost;
                    logStr += ';status=' + recipients[i].status; // status is either "Success" or "error message"
                    logStr += ';statusCode=' + recipients[i].statusCode;
                    console.log(logStr);
                }
            } else {
                console.log('Error while sending: ' + jsObject.SMSMessageData.Message);
            }
        });
    });

    // Add post parameters to the http request
    post_req.write(post_data);

    post_req.end();
}

exports.sendEmail = (name, mail, tempID) => {
    let transporter = nodemailer.createTransport({
        host: process.env.MAILHOST,
        port: process.env.MAILPORT,
        secure: false, // true for 465, false for other ports
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASS
        }
    });

    //using engine for mail view
    transporter.use('compile', hbs({
        viewEngine: 'handlebars',
        viewPath: './src/lib/template/',
        extName: '.html'
    }));

    transporter.sendMail({
        from: `ADP National Secretariat <contact@adp.ng>`, // sender address
        to: `${mail}`, // list of receivers
        subject: `${name} Congratulations!, You are now A Member of ADP`, // Subject line
        template: 'emailtempl', // email template
        context: {
            fullName: `${name}`,
            member_id: `${tempID}`,
        }
    }, (err, info) => {
        if (!err) {
            console.log('Message sent: %s', info.messageId);
        } else {
            console.log(err.message);
        }
    });
}

exports.jsonConverter = (req, res) => {


    let medium = `https://medium.com/feed/action-democratic-party`;
    let jsonCon = `https://api.rss2json.com/v1/api.json`;

    let jsonApiConverter = `${jsonCon}?rss_url=${medium}`;

    fetch(jsonApiConverter)
        .then((res) => { return res.json() })
        .then((data) => {
            res.send(data)
        }).catch(err => {
            res.status(500).json({
                error: err.message
            });
        });


}