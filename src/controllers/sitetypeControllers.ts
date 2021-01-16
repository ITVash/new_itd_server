import { Request, Response } from "express"
import sitetypeModel, { ISiteType } from "../models/sitetypeModels"

class sitetypeControllers {
	create = async (req: Request, res: Response): Promise<void> => {
		try {
			const data: ISiteType = req.body
			const sitetype = await sitetypeModel.create(data)
			res.status(201).json({
				status: "success",
				data: sitetype,
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
			const sitetype = await sitetypeModel.find({}).exec()
			res.status(200).json({
				status: "success",
				data: sitetype,
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
			const data: ISiteType = req.body
			const sitetype = await sitetypeModel
				.findOneAndUpdate({ _id: id }, data, { new: true })
				.exec()
			if (!sitetype) {
				res.status(404).json({
					status: "Error",
					message: "Данные О Нас отсутствуют",
				})
				return
			}
			res.status(200).json({
				status: "success",
				data: sitetype,
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
			const sitetype = await sitetypeModel.findOneAndDelete({ _id: id }).exec()
			res.status(200).json({
				status: "success",
				data: sitetype,
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка работы сервера. ${err}`,
			})
		}
	}
}

export const sitetypeCtrl = new sitetypeControllers()
