import { Request, Response } from "express"
import notifyModel, { INotify } from "../models/notifyModels"
import webPush from "web-push"
interface ISubj {
	title: string
	body: string
	link: string
}
class notifyControllers {
	create = async (req: Request, res: Response): Promise<void> => {
		try {
			const data: INotify = req.body
			const notify = await notifyModel.create(data)
			res.status(201).json({
				status: "success",
				data: notify,
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: "Ошибка работы сервера",
			})
		}
	}

	show = async (_: any, res: Response): Promise<void> => {
		try {
			const notify = await notifyModel.find({}).exec()

			res.status(200).json({
				status: "success",
				data: notify,
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: "Ошибка работы сервера",
			})
		}
	}
	showPoint = async (req: Request, res: Response): Promise<void> => {
		try {
			const data: INotify = req.body
			const point = req.body.endpoint
			const notify = await notifyModel
				.findOne({ endpoint: String(point) })
				.exec()
			if (!notify) {
				const notifyCreate = await notifyModel.create(data)
				res.status(201).json({
					status: "success",
					data: notifyCreate,
				})
				return
			}
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: "Ошибка работы сервера",
			})
		}
	}
	send = async (req: Request, res: Response): Promise<void> => {
		try {
			const data: ISubj = req.body
			const subjects = JSON.stringify({
				title: data.title,
				body: data.body,
				link: data.link,
			})
			const users: INotify[] = []
			const notify = await notifyModel.find({}).exec()
			notify.forEach((item) => users.push(item))
			users.forEach((item) => {
				webPush.sendNotification(item, subjects)
			})
			res.status(200).json({
				status: "success",
				message: "Сообщения отправленны",
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: "Ошибка работы сервера",
			})
		}
	}

	update = async (req: Request, res: Response): Promise<void> => {
		try {
			const id = req.params.id
			const data: INotify = req.body
			const notify = await notifyModel
				.findOneAndUpdate({ _id: id }, data, { new: true })
				.exec()
			if (!notify) {
				res.status(200).json({
					status: "Error",
					message: "Данные О Нас отсутствуют",
				})
				return
			}
			res.status(200).json({
				status: "success",
				data: notify,
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка работы сервера. ${err}`,
			})
		}
	}
	delete = async (req: Request, res: Response): Promise<void> => {
		try {
			const id = req.body.endpoint
			const notify = await notifyModel.findOneAndDelete({ endpoint: id }).exec()
			res.status(200).json({
				status: "success",
				data: notify,
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка работы сервера. ${err}`,
			})
		}
	}
}

export const notifyCtrl = new notifyControllers()
