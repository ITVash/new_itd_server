import nodemailer from "nodemailer"

const mail = nodemailer.createTransport({
	host: process.env.MAIL_HOST || "smtp.mail.ru",
	port: Number(process.env.MAIL_PORT) || 587,
	secure: true,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
})
export default mail
