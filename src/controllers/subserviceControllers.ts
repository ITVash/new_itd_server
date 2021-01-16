import { Request, Response } from "express"
import subserviceModel, { ISubService } from "../models/subserviceModels"

class subserviceControllers {
	create = async (req: Request, res: Response): Promise<void> => {
		try {
			const data: ISubService = req.body
			const subservice = await subserviceModel.create(data)
			res.status(201).json({
				status: "success",
				data: subservice,
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
			const subservice = await subserviceModel.find({}).exec()
			res.status(200).json({
				status: "success",
				data: subservice,
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
			const data: ISubService = req.body
			const subservice = await subserviceModel
				.findOneAndUpdate({ _id: id }, data, { new: true })
				.exec()
			if (!subservice) {
				res.status(404).json({
					status: "Error",
					message: "Данные О Нас отсутствуют",
				})
				return
			}
			res.status(200).json({
				status: "success",
				data: subservice,
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
			const id = req.params.id
			const subservice = await subserviceModel
				.findOneAndDelete({ _id: id })
				.exec()
			res.status(200).json({
				status: "success",
				data: subservice,
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка работы сервера. ${err}`,
			})
		}
	}
}

export const subserviceCtrl = new subserviceControllers()
