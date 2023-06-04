const nodemailer = require("nodemailer");

exports.sendVerification = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: false,
      port: 587,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Alert from Bchoclub",
      html: `<p>Thankyou for choosing Bechoclub <b>${otp}</b> is your verification code for Bechoclub</p> <p> it will be valid for <b> 3 minutes</b></p>`,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log(info.response);
  } catch (error) {
    console.log(error);
  }
};

exports.sendPasswordVerification = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: false,
      port: 587,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Alert from Bchoclub",
      html: `<p>Forgot pasword? No worries <b>${otp}</b> is your verification code for password reset </p> <p> code will be valid for <b> 3 minutes</b></p>`,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log(info.response);
  } catch (error) {
    console.log(error);
  }
};