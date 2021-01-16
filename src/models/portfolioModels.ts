import mongoose, { model, Schema, Document } from "mongoose"

export interface IPortfolio {
	_id?: string
	title?: string
	desc?: string
	proj?: string
	prev?: string
	link?: string
}
export type IPortfolioModel = IPortfolio & Document

const portfolioSchema = new Schema<IPortfolio>(
	{
		title: { type: String, default: "Описание услуг" },
		desc: { type: String, default: "Почему мы" },
		proj: { type: String, default: "Be" },
		prev: { type: String, default: "Tg" },
		link: { type: String, default: "VK" },
	},
	{ versionKey: false, timestamps: true },
)

const portfolioModel = model<IPortfolioModel>("Portfolio", portfolioSchema)
export default portfolioModel
