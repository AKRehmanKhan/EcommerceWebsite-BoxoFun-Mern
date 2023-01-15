const nodeMailer = require("nodemailer");
const config = require("../config/config")

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: config.SMPT_HOST,
    port: config.SMPT_PORT,
    service: config.SMPT_SERVICE,
    secure:true,
    auth: {
      user: config.SMPT_MAIL,
      pass: config.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: config.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
