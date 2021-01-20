import { Request, Response } from "express"
import { validationResult } from "express-validator"
import jwt from "jsonwebtoken"
import path from "path"
import userModel, { IUser, IUserModel } from "../models/userModels"
import { generateMD5 } from "../utils/generateHash"
import { sendEmail } from "../utils/sendEmail"
class userControllers {
	create = async (req: Request, res: Response): Promise<void> => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				res.status(400).json({
					status: "Error",
					message: errors.array(),
				})
				return
			}
			const data: IUser = req.body
			const postData: IUser = {
				login: data.login,
				email: data.email,
				password: data.password,
				confirmed_hash: generateMD5(
					process.env.SECRET_KEY + Math.random().toString() ||
						Math.random().toString(),
				),
				phone: data.phone,
			}
			const user = await userModel.create(postData)
			res.status(201).json({
				status: "success",
				data: user,
			})
			sendEmail(
				{
					mailTo: data.email,
					subject: "Подтверждение почты ДонецкСити",
					html: `Для того что бы подтвердить почту, перейдите <a href="${process.env.SITE}/api/auth/verify?hash=${postData.confirmed_hash}">по этой ссылке</a>`,
				},
				(err: Error | null) => {
					if (err) {
						res.status(400).json({
							status: "Error",
							message: `Ошибка при добавлении нового пользователя. ${err}`,
						})
					}
				},
			)
		} catch (error) {
			res.status(400).json({
				status: "Error",
				message: `Ошибка при добавлении нового пользователя. ${error}`,
			})
		}
	}
	show = async (_: any, res: Response): Promise<void> => {
		try {
			const user = await userModel.find({}).exec()
			if (user.length <= 0) {
				const dataAdmin: IUser = {
					login: "Admin",
					confirm: true,
					email: "itdwebcompany@gmail.com",
					confirmed_hash: generateMD5(
						process.env.SECRET_KEY + Math.random().toString() ||
							Math.random().toString(),
					),
					password: generateMD5(
						"Y@ledyjqY@gbkmybr2020" + process.env.SECRET_KEY,
					),
				}
				await userModel.create(dataAdmin)
				res.status(200).json({
					status: "Error",
					message: "Таблица пользователей пуста!",
				})
				return
			}
			res.status(200).json({
				status: "success",
				data: user,
			})
		} catch (error) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка вывода. Ошибка:${error}`,
			})
		}
	}
	verify = async (req: Request, res: Response): Promise<void> => {
		try {
			const hash: string | any = req.query.hash
			const user = await userModel.findOne({ confirmed_hash: hash }).exec()
			if (!user) {
				res.status(400).json({
					status: "Error",
					message: "Пользователь не найден",
				})
				return
			}
			user.confirm = true
			user.save()
			//res.status(200).json({ status: "success" })
			res.sendFile(path.resolve("client", "index.html"))
		} catch (error) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка сервера. ${error}`,
			})
		}
	}
	showUser = async (req: Request, res: Response): Promise<void> => {
		try {
			const userID: string | any = req.params.id
			const user = await userModel.findById(userID).exec()
			if (!user) {
				res.status(400).json({
					status: "success",
					message: "Пользователь не найден!",
				})
				return
			}
			res.status(200).json({
				status: "success",
				data: user,
			})
		} catch (error) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка сервера2. ${error}`,
			})
		}
	}
	signIn = async (req: Request, res: Response): Promise<void> => {
		try {
			const user = req.user ? (req.user as IUserModel).toJSON() : undefined

			res.status(200).json({
				status: "success",
				data: {
					...user,
					token: jwt.sign(
						{ user: req.user },
						process.env.SECRET_KEY || "1234321",
						{
							expiresIn: "30 days",
						},
					),
				},
			})
		} catch (error) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка сервера1. ${error}`,
			})
		}
	}
	signInSoc = async (req: Request, res: Response): Promise<void> => {
		try {
			const user = req.user ? (req.user as IUserModel).toJSON() : undefined
			if (req.isAuthenticated()) {
			}
			const tok = jwt.sign(
				{ user: req.user },
				process.env.SECRET_KEY || "1234321",
				{
					expiresIn: "30 days",
				},
			)
			res.send(`
      <script>
				localStorage.setItem('token', '${`${tok}`}');
				window.location.href = '/'
      </script>
      `)
			/* res.status(200).json({
				status: "success",
				data: {
					...user,
					token: tok,
				},
			}) */
		} catch (error) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка сервера1. ${error}`,
			})
		}
	}
	getMe = async (req: Request, res: Response): Promise<void> => {
		try {
			if (!req.isAuthenticated()) {
				console.log("Вы не авторизованны")
				return
			}
			console.log("user", req.user)
			res.status(200).json({
				status: "success",
				data: req.user,
			})
		} catch (error) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка сервера при получении токена. ${error}`,
			})
		}
	}
	editUser = async (req: Request, res: Response): Promise<void> => {
		try {
			const data: IUser = req.body
			const id = req.params.id

			const user = await userModel
				.findByIdAndUpdate({ _id: id }, data, { new: true })
				.exec()
			if (!user) {
				res.status(404).json({
					status: "Error",
					message: `Пользователь не найден.`,
				})
			}
			res.status(200).json({
				status: "success",
				data: user,
			})
		} catch (error) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка сервера, при обновлении данных пользователя. ${error}`,
			})
		}
	}
	deleteUser = async (req: Request, res: Response): Promise<void> => {
		try {
			const id = req.params.id
			const user = userModel.findOneAndDelete({ _id: id }).exec()
			res.status(200).json({
				status: "success",
				data: await user,
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка работы сервера. ${err}`,
			})
		}
	}
	remember = async (req: Request, res: Response): Promise<void> => {
		try {
			const data: IUser = req.body
			const dataMail = data.email
			const userFind = await userModel.findOne({ email: dataMail }).exec()
			if (!userFind) {
				res.status(200).json({
					status: "Error",
					message: `Пользователь не найден`,
				})
				return
			}
			const newPass = generateMD5(
				String(userFind?.phone) + process.env.SECRET_KEY,
			)
			const updUser = await userModel
				.findByIdAndUpdate(
					{ _id: userFind?._id },
					{
						password: newPass,
					},
					{ new: true },
				)
				.exec()
			if (updUser)
				sendEmail(
					{
						mailTo: updUser.email,
						subject: "Восстановление доступа ДонецкСити",
						html: `Ваш новый пароль, номер телефона указанный при регистрации. После входа в приложение, измените пароль!`,
					},
					(err: Error | null) => {
						if (err) {
							res.status(400).json({
								status: "Error",
								message: `Ошибка при добавлении нового пользователя. ${err}`,
							})
						}
					},
				)
			res.status(200).json({
				status: "success",
				message: "Пароль изменен",
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка работы сервера. ${err}`,
			})
		}
	}
}

export const userCtrl = new userControllers()
