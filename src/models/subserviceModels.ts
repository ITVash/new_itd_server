import mongoose, { model, Schema, Document } from "mongoose"

export interface ISubService {
	_id?: string
	title?: string
	serviceID?: string
	body?: string
	img1?: string
	img2?: string
	text1?: string
	text2?: string
}
export type ISubServiceModel = ISubService & Document

const subserviceSchema = new Schema<ISubService>(
	{
		title: { type: String, default: "Описание услуг" },
		serviceID: { type: String, default: "ID услуги" },
		body: { type: String, default: "текст" },
		img1: { type: String, default: "" },
		img2: { type: String, default: "" },
		text1: { type: String, default: "текст" },
		text2: { type: String, default: "текст" },
	},
	{ versionKey: false, timestamps: true },
)

const subserviceModel = model<ISubServiceModel>("SubService", subserviceSchema)
export default subserviceModel
