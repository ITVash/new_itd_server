import { Request, Response } from "express"
import homeModel, { IHome } from "../models/homeModels"

class homeControllers {
	create = async (req: Request, res: Response): Promise<void> => {
		try {
			const data: IHome = req.body
			const home = await homeModel.create(data)
			res.status(201).json({
				status: "success",
				data: home,
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: "Ошибка работы сервера",
			})
		}
	}

	show = async (req: Request, res: Response): Promise<void> => {
		try {
			const home = await homeModel.find({}).exec()
			const data: IHome = req.body
			let seedHome
			if (!home || home.length <= 0) {
				seedHome = await homeModel.create(data)
			}
			res.status(200).json({
				status: "success",
				data: home || seedHome,
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
			const data: IHome = req.body
			const home = await homeModel
				.findOneAndUpdate({ _id: id }, data, { new: true })
				.exec()
			if (!home) {
				res.status(404).json({
					status: "Error",
					message: "Данные О Нас отсутствуют",
				})
				return
			}
			res.status(200).json({
				status: "success",
				data: home,
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
			const home = await homeModel.findOneAndDelete({ _id: id }).exec()
			res.status(200).json({
				status: "success",
				data: home,
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка работы сервера. ${err}`,
			})
		}
	}
}

export const homeCtrl = new homeControllers()
