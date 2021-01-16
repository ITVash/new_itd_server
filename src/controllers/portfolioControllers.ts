import { Request, Response } from "express"
import portfolioModel, { IPortfolio } from "../models/portfolioModels"

class portfolioControllers {
	create = async (req: Request, res: Response): Promise<void> => {
		try {
			const data: IPortfolio = req.body
			const portfolio = await portfolioModel.create(data)
			res.status(201).json({
				status: "success",
				data: portfolio,
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
			const portfolio = await portfolioModel.find({}).exec()
			res.status(200).json({
				status: "success",
				data: portfolio,
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
			const data: IPortfolio = req.body
			const portfolio = await portfolioModel
				.findOneAndUpdate({ _id: id }, data, { new: true })
				.exec()
			if (!portfolio) {
				res.status(404).json({
					status: "Error",
					message: "Данные О Нас отсутствуют",
				})
				return
			}
			res.status(200).json({
				status: "success",
				data: portfolio,
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
			const portfolio = await portfolioModel
				.findOneAndDelete({ _id: id })
				.exec()
			res.status(200).json({
				status: "success",
				data: portfolio,
			})
		} catch (err) {
			res.status(500).json({
				status: "Error",
				message: `Ошибка работы сервера. ${err}`,
			})
		}
	}
}

export const portfolioCtrl = new portfolioControllers()
