import mail from "../core/mail"
import { SentMessageInfo } from "nodemailer/lib/sendmail-transport"
interface sendEmailProps {
	mailTo: string
	subject: string
	html: string
}
export const sendEmail = (
	{ mailTo, subject, html }: sendEmailProps,
	callback?: (err: Error | null, info: SentMessageInfo) => void,
) => {
	mail.sendMail(
		{
			from: "Донецк Сити <max.zolotof@mail.ru>",
			to: mailTo,
			subject: subject,
			text: "Сообщение с сайта",
			html: html,
		},
		callback ||
			function (err: Error | null, info: SentMessageInfo) {
				if (err) {
					console.log(err)
				} else {
					console.log(info)
				}
			},
	)
}
