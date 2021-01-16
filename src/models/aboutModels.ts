import mongoose, { model, Schema, Document } from "mongoose"

type TAdvant = {
	title: string
	icon: string
}

export interface IAbout {
	_id?: string
	title?: string
	desc?: string
	why?: string
	photo1?: string
	photo2?: string
	photo3?: string
	video?: string
	phone?: string
	email?: string
	work?: TAdvant[]
}
export type IAboutModel = IAbout & Document

const aboutSchema = new Schema<IAbout>(
	{
		title: { type: String, default: "Заголовок" },
		desc: { type: String, default: "Описание" },
		why: { type: String, default: "Почему мы" },
		photo1: { type: String, default: "" },
		photo2: { type: String, default: "" },
		photo3: { type: String, default: "" },
		video: { type: String, default: "" },
		phone: { type: String, default: "Телефон" },
		email: { type: String, default: "Почта" },
		work: [
			{
				title: { type: String, default: "Заголовок" },
				icon: { type: String, default: "" },
			},
		],
	},
	{ versionKey: false, timestamps: true },
)

const aboutModel = model<IAboutModel>("About", aboutSchema)
export default aboutModel
