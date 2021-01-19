import express from "express"
import multer from "multer"
import path from "path"
import webPush from "web-push"
import { aboutCtrl } from "../controllers/aboutControllers"
import { homeCtrl } from "../controllers/homeControllers"
import { notifyCtrl } from "../controllers/notifyControllers"
import { portfolioCtrl } from "../controllers/portfolioControllers"
import { serviceCtrl } from "../controllers/serviceControllers"
import { sitetypeCtrl } from "../controllers/sitetypeControllers"
import { subserviceCtrl } from "../controllers/subserviceControllers"
import { userCtrl } from "../controllers/userControllers"
import { sendEmail } from "../utils/sendEmail"
import { validRegist } from "../validators/validForm"
import { passport } from "./passport"
type TMess = {
	from?: string
	to?: string
	subject?: string
	html?: string
	text?: string
}
const createRoutes = (app: express.Express): void => {
	webPush.setVapidDetails(
		"mailto:vashdns@gmail.com",
		`${process.env.PUBLIC_KEY}`,
		`${process.env.PRIVATE_KEY}`,
	)
	/**
	 * Хранилища, для загружаемых файлов
	 */
	const storageFiles = multer.diskStorage({
		destination: (req, file, cb): void => {
			cb(null, "upload")
		},
		filename: (req, file, cb): void => {
			cb(null, `${Date.now()}_${file.originalname}`)
		},
	})
	let uploadFiles = multer({ storage: storageFiles })

	app.use("/", express.static(path.join("client")))

	app.get("/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/admin/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/forus/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/contacts/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/parking/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/plan/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/shops/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/entertainment/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/food/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/news/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/news/*", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/stock/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/stock/*", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/events/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/events/*", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/profile/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/tenantoffice/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/tenant/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/tenant/*", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/services/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/rules/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})
	app.get("/error/", (req: express.Request, res: express.Response) => {
		res.sendFile(path.resolve("client", "index.html"))
	})

	/**
	 * Роуты загрузки файлов
	 */
	app.post(
		"/api/attachments",
		//passport.authenticate("jwt", { session: false }),
		uploadFiles.single("file"),
		async (req: express.Request, res: express.Response): Promise<void> => {
			try {
				const file = req.file
				res.status(201).json({
					status: "success",
					data: file,
					path: file.path,
				})
			} catch (error) {
				res.status(500).json({
					status: "Error",
					message: `Ошибка загрузки файлов. ${error}`,
				})
			}
		},
	)
	app.post(
		"/api/attachmentsMany",
		//passport.authenticate("jwt", { session: false }),
		uploadFiles.array("file"),
		async (req: express.Request, res: express.Response): Promise<void> => {
			try {
				const file = req.files
				res.status(201).json({
					status: "success",
					data: file,
				})
			} catch (error) {
				res.status(500).json({
					status: "Error",
					message: `Ошибка загрузки файлов. ${error}`,
				})
			}
		},
	)

	/**
	 * Роуты профилей позьзователей
	 */
	app.get("/api/users", userCtrl.show) //Показ всех пользователей
	app.get("/api/users/:id", userCtrl.showUser) //Поиск пользователя по его ID
	app.get(
		"/api/auth/me",
		passport.authenticate("jwt", { session: false }),
		userCtrl.getMe,
	) //Информация о пользователе
	app.get("/api/auth/verify", userCtrl.verify) //Верификация пользователя
	app.post("/api/signup", validRegist, userCtrl.create) //Создание нового пользователя
	app.post("/api/signin", passport.authenticate("local"), userCtrl.signIn) //Авторизация пользователя с использованием паспорта
	app.get(
		"/api/auth/vk",
		passport.authenticate("vkontakte", { scope: ["email"], session: false }),
		async (req: express.Request, res: express.Response): Promise<void> => {
			try {
				res.json({
					status: "success",
					data: req.user,
				})
			} catch (error) {
				console.log(error)
			}
		},
	) //Авторизация пользователя с использованием паспорта в VK
	app.get(
		"/api/auth/vk/login",
		passport.authenticate("vkontakte", {
			scope: ["email"],
			session: true,
			//successRedirect: "/",
			failureRedirect: "/",
		}),
		userCtrl.signInSoc,
	) //Авторизация пользователя с использованием паспорта в VK
	app.get(
		"/api/auth/fb",
		passport.authenticate("facebook", { scope: ["email"], session: false }),
		async (req: express.Request, res: express.Response): Promise<void> => {
			try {
				res.json({
					status: "success",
					data: req.user,
				})
			} catch (error) {
				console.log(error)
			}
		},
	) //Авторизация пользователя с использованием паспорта в Facebook
	app.get(
		"/api/auth/fb/login",
		passport.authenticate("facebook", {
			scope: ["email"],
			session: true,
			//successRedirect: "/",
			failureRedirect: "/",
		}),
		userCtrl.signInSoc,
	) //Авторизация пользователя с использованием паспорта в Facebook
	app.get(
		"/api/auth/google",
		passport.authenticate("google", {
			scope: ["email"],
			session: false,
		}),
		async (req: express.Request, res: express.Response): Promise<void> => {
			try {
				res.json({
					status: "success",
					data: req.user,
				})
			} catch (error) {
				console.log(error)
			}
		},
	) //Авторизация пользователя с использованием паспорта в Google
	app.get(
		"/api/auth/google/login",
		passport.authenticate("google", {
			session: true,
			//successRedirect: "/",
			failureRedirect: "/",
		}),
		userCtrl.signInSoc,
	) //Авторизация пользователя с использованием паспорта в Google
	app.put(
		"/api/users/:id",
		passport.authenticate("jwt", { session: false }),
		userCtrl.editUser,
	) //Обновление данных пользователя
	app.delete(
		"/api/users/:id",
		passport.authenticate("jwt", { session: false }),
		userCtrl.deleteUser,
	) //Обновление данных пользователя
	app.post("/api/users/remember", userCtrl.remember) //Обновление данных пользователя

	/**
	 * О Нас
	 */
	app.post(
		"/api/about",
		passport.authenticate("jwt", { session: false }),
		aboutCtrl.create,
	) //Добавление О Нас
	app.get("/api/about", aboutCtrl.show) //Показать О Нас
	app.put(
		"/api/about/:id",
		//passport.authenticate("jwt", { session: false }),
		aboutCtrl.update,
	) //Редактировать О Нас
	app.delete(
		"/api/about/:id",
		passport.authenticate("jwt", { session: false }),
		aboutCtrl.delete,
	) //Удалить О Нас

	/**
	 * Главная
	 */
	app.post(
		"/api/home",
		passport.authenticate("jwt", { session: false }),
		homeCtrl.create,
	) //Добавление Главной
	app.get("/api/home", homeCtrl.show) //Показать Главной
	app.put("/api/home/:id", homeCtrl.update) //Редактировать Главной
	app.delete(
		"/api/home/:id",
		passport.authenticate("jwt", { session: false }),
		homeCtrl.delete,
	) //Удалить Главной

	/**
	 * Портфолио
	 */
	app.post(
		"/api/portfolio",
		//passport.authenticate("jwt", { session: false }),
		portfolioCtrl.create,
	) //Добавление Портфолио
	app.get("/api/portfolio", portfolioCtrl.show) //Показать Портфолио
	app.put(
		"/api/portfolio/:id",
		//passport.authenticate("jwt", { session: false }),
		portfolioCtrl.update,
	) //Редактировать Портфолио
	app.delete(
		"/api/portfolio/:id",
		//passport.authenticate("jwt", { session: false }),
		portfolioCtrl.delete,
	) //Удалить Портфолио

	/**
	 * Саб Сервисы
	 */
	app.post(
		"/api/subservice",
		//passport.authenticate("jwt", { session: false }),
		subserviceCtrl.create,
	) //Добавление Саб Сервисы
	app.get("/api/subservice", subserviceCtrl.show) //Показать Саб Сервисы
	app.put(
		"/api/subservice/:id",
		//passport.authenticate("jwt", { session: false }),
		subserviceCtrl.update,
	) //Редактировать Саб Сервисы
	app.delete(
		"/api/subservice/:id",
		//passport.authenticate("jwt", { session: false }),
		subserviceCtrl.delete,
	) //Удалить Саб Сервисы

	/**
	 * Сервисы
	 */
	app.post(
		"/api/service",
		//passport.authenticate("jwt", { session: false }),
		serviceCtrl.create,
	) //Добавление Сервисы
	app.get("/api/service", serviceCtrl.show) //Показать Сервисы
	app.put(
		"/api/service/:id",
		//passport.authenticate("jwt", { session: false }),
		serviceCtrl.update,
	) //Редактировать Сервисы

	app.delete(
		"/api/service/:id",
		//passport.authenticate("jwt", { session: false }),
		serviceCtrl.delete,
	) //Удалить Сервисы

	/**
	 * Типы сайтов
	 */
	app.post(
		"/api/sitetype",
		//passport.authenticate("jwt", { session: false }),
		sitetypeCtrl.create,
	) //Добавление Типы сайтов
	app.get("/api/sitetype", sitetypeCtrl.show) //Показать Типы сайтов
	app.put(
		"/api/sitetype/:id",
		//passport.authenticate("jwt", { session: false }),
		sitetypeCtrl.update,
	) //Редактировать Типы сайтов
	app.delete(
		"/api/sitetype/:id",
		//passport.authenticate("jwt", { session: false }),
		sitetypeCtrl.delete,
	) //Удалить Типы сайтов

	/**
	 * Пуш уведомления
	 */
	app.post("/api/notify/subscribe", notifyCtrl.create)
	app.post("/api/notify/send", notifyCtrl.send)
	app.post("/api/notify/", notifyCtrl.showPoint)
	app.patch("/api/notify/", notifyCtrl.delete)

	/**
	 * Send Mail
	 */
	app.post(
		"/api/sendform",
		async (req: express.Request, res: express.Response) => {
			const data: { name: string; phone: string; email: string; text: string } =
				req.body
			if (!data.name || !data.phone || !data.email || !data.text)
				return res.status(400).json({ message: "Поля не могут быть пустыми" })
			//itdwebcompany@gmail.com
			const mess = {
				from: "robot@itd.company",
				to: "itdwebcompany@gmail.com",
				subject: "Обратная связь с сайта",
				text: `${data.text}`,
				html: `<p>Имя отправителя: ${data.name}</p>
			<p>Телефон отправителя: ${data.phone}</p>
			<p>Почта отправителя: ${data.email}</p>
			<p>Сообщение: <br /> ${data.text}</p>`,
			}
			sendEmail(
				{ mailTo: mess.to!, subject: mess.subject!, html: mess.html! },
				(err: Error | null) => {
					if (err) {
						res.status(400).json({
							status: "Error",
							message: `Ошибка отправки формы. ${err}`,
						})
					}
				},
			)
			//console.log('data', data)
		},
	)

	app.post(
		"/api/sendclick",
		async (req: express.Request, res: express.Response) => {
			const data = req.body
			if (!data.forms[0] || !data.forms[1] || !data.forms[2] || !data.forms[3])
				return res
					.status(400)
					.json({ message: "Поля не могут быть пустыми", data })
			const mess: TMess = {
				from: "robot@itd.company",
				to: "itdwebcompany@gmail.com",
				subject: "Чеклист с сайта",
				text: `${data.forms[3]}`,
				html: `<p>Имя отправителя: ${data.forms[0]}</p>
			<p>Телефон отправителя: ${data.forms[1]}</p>
			<p>Почта отправителя: ${data.forms[2]}</p>
			<p>Сообщение: <br /> ${data.forms[3]}</p>
			<p>Данные чекбокса:</p>
			<p>Тип сайта: ${data.list1}</p>
			<p>Языки: ${data.list2}</p>
			<p>Сроки: ${data.list3}</p>
			<p>Наличие логотипа или фирменного стиля: ${data.list4}</p>`,
			}
			sendEmail(
				{ mailTo: mess.to!, subject: mess.subject!, html: mess.html! },
				(err: Error | null) => {
					if (err) {
						res.status(400).json({
							status: "Error",
							message: `Ошибка отправки чеклиста. ${err}`,
						})
					}
				},
			)
		},
	)
}

export default createRoutes
