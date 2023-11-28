import mailConfig from "../config/mail.config";
import nodeMailer from "nodemailer";
import moment from "moment/moment";
import template from "lodash.template";
import typeMessage from "./typeMessage";

const sendMail = async (email, OTP, typeMessage) => {
  const htmlContent = getMsgBody(OTP, typeMessage);

  const transport = nodeMailer.createTransport({
    host: mailConfig.HOST,
    port: mailConfig.PORT,
    secure: false,
    auth: {
      user: mailConfig.USERNAME,
      pass: mailConfig.PASSWORD,
    },
  });

  const options = {
    from: mailConfig.FROM_ADDRESS,
    to: email,
    subject: "Test",
    html: htmlContent,
  };

  let message;
  try {
    message = await sendOTP(transport, options);
    console.log(message);
    if (message && message.includes("250 2.0.0 OK")) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
async function sendOTP(transport, options) {
  return new Promise((resolve, reject) => {
    transport.sendMail(options, function (error, info) {
      if (error) {
        console.log(error);
        reject(false);
      } else {
        console.log(info.response);
        resolve(info.response);
      }
      transport.close();
    });
  });
}

const getMsgBody = (OTP, type) => {
  const FORMATTED_TIME = getTimeExpTime5Minutes();
  let message;
  if (type === typeMessage.REGISTER) {
    message =
      "We have received a request to register an account.<br>Your OTP is: <%= OTP %><br><br>Please enter this code on the password reset page to proceed. This code will be valid until <%= FORMATTED_TIME %><br>If you did not request a password reset, please ignore this message and take appropriate measures to secure your account.<br><br>Thank you for using our service.<br><br>Best regards";
  } else {
    message =
      "We have received a request to forgot the password for your account.<br>Your OTP is: <%= OTP %><br><br>Please enter this code on the password reset page to proceed. This code will be valid until <%= FORMATTED_TIME %><br>If you did not request a password reset, please ignore this message and take appropriate measures to secure your account.<br><br>Thank you for using our service.<br><br>Best regards";
  }

  const compiledTemplate = template(message);
  return compiledTemplate({ OTP, FORMATTED_TIME });
};

const getTimeExpTime5Minutes = () => {
  const expTime = moment().add(5, "minutes").format("YYYY-MM-DD HH:mm:ss");
  return expTime;
};

export default sendMail;
