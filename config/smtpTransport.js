// require('dotenv').config();
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport(
  // 'SMTP',
  {
    service: process.env.TT_SMTP_SERVICE,
    auth: {
      user: process.env.TT_SMTP_USER ,
      pass: process.env.TT_SMTP_PASS
    }
  });

  module.exports = smtpTransport;
