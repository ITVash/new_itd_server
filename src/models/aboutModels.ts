import mongoose, { model, Schema, Document } from "mongoose"
interface IAdvantages {
	title?: string
	text?: string
}
interface ISlider {
	destination: string
	encoding: string
	fieldname: string
	filename: string
	mimetype: string
	originalname: string
	path: string
	size: number
}
export interface IAbout {
	_id?: string
	shops?: string
	films?: string
	cars?: string
	fans?: string
	desc?: string
	vk?: string
	inst?: string
	fab?: string
	rules?: ISlider
	slider?: Array<ISlider>
	preview?: Array<ISlider>
	advantages?: Array<IAdvantages>
}
export type IAboutModel = IAbout & Document

const aboutSchema = new Schema<IAbout>(
	{
		shops: { type: String, default: "Количество магазинов" },
		films: { type: String, default: "Количество кинотеатров" },
		cars: { type: String, default: "Количество парковочных мест" },
		fans: { type: String, default: "Центр развлечений" },
		vk: { type: String, default: "VK" },
		inst: { type: String, default: "Instagram" },
		fab: { type: String, default: "facebook" },
		desc: { type: String, default: "Описание" },
		preview: [
			{
				destination: { type: String, default: "" },
				encoding: { type: String, default: "" },
				fieldname: { type: String, default: "" },
				filename: { type: String, default: "" },
				mimetype: { type: String, default: "" },
				originalname: { type: String, default: "" },
				path: { type: String, default: "" },
				size: { type: Number, default: 0 },
			},
		],
		rules: {
			destination: { type: String, default: "" },
			encoding: { type: String, default: "" },
			fieldname: { type: String, default: "" },
			filename: { type: String, default: "" },
			mimetype: { type: String, default: "" },
			originalname: { type: String, default: "" },
			path: { type: String, default: "" },
			size: { type: Number, default: 0 },
		},
		slider: [
			{
				destination: { type: String, default: "" },
				encoding: { type: String, default: "" },
				fieldname: { type: String, default: "" },
				filename: { type: String, default: "" },
				mimetype: { type: String, default: "" },
				originalname: { type: String, default: "" },
				path: { type: String, default: "" },
				size: { type: Number, default: 0 },
			},
		],
		advantages: [
			{
				title: { type: String, default: "Преимущества" },
				text: { type: String, default: "Текст преимущества" },
			},
		],
	},
	{ versionKey: false, timestamps: true },
)

const aboutModel = model<IAboutModel>("About", aboutSchema)
export default aboutModel
