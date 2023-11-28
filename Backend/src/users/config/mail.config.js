const MAILER = process.env.MAIL_MAILER;
const HOST = process.env.MAIL_HOST;
const PORT = process.env.MAIL_PORT;
const USERNAME = process.env.MAIL_USERNAME;
const PASSWORD = process.env.MAIL_PASSWORD;
const ENCRYPTION = process.env.MAIL_ENCRYPTION;
const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS;
const FROM_NAME = process.env.MAIL_FROM_NAME;

module.exports = { MAILER, HOST, PORT, USERNAME, PASSWORD, ENCRYPTION, FROM_ADDRESS, FROM_NAME };
