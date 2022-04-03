const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
	//SMPT - Simple Mail Transfer Protocol
	const transporter = nodeMailer.createTransport({
		service: process.env.SMPT_SERVICE,
		auth: {
			user: process.env.SMPT_USER,
			pass: process.env.SMPT_PASSWORD,
		}
	});

	const mailOptions = {
		from: process.env.SMPT_USER,
		to: options.email,
		subject: options.subject,
		text: options.message,
	}

	await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;