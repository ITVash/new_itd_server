import { Request, Response } from "express"
import serviceModel, { IService } from "../models/serviceModels"

class serviceControllers {
	create = async (req: Request, res: Response): Promise<void> => {
		try {
			const data: IService = req.body
			const service = await serviceModel.create(data)
			res.status(201).json({
				status: "success",
				data: service,
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
			const service = await serviceModel.find({}).populate("subService").exec()
			res.status(200).json({
				status: "success",
				data: service,
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
			const data: IService = req.body
			const service = await serviceModel
				.findOneAndUpdate({ _id: id }, data, { new: true })
				.exec()
			if (!service) {
				res.status(404).json({
					status: "Error",
					message: "Данные О Нас отсутствуют",
				})
				return
			}
			res.status(200).json({
				status: "success",
				data: await service.populate("subService").execPopulate(),
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
			const service = await serviceModel.findOneAndDelete({ _id: id }).exec()
			res.status(200).json({
				status: "success",
				data: service,
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка работы сервера. ${err}`,
			})
		}
	}
}

export const serviceCtrl = new serviceControllers()
