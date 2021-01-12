import mongoose, { model, Schema, Document } from "mongoose"
type TAdvant = {
	title: string
	icon: string
}

export interface IHome {
	_id?: string
	advantages?: TAdvant[]
	serviceDesc?: string
	whyWe?: string
	vk?: string
	fb?: string
	inst?: string
	be?: string
	tg?: string
	pin?: string
	twit?: string
	youtube?: string
}
export type IHomeModel = IHome & Document

const homeSchema = new Schema<IHome>(
	{
		serviceDesc: { type: String, default: "Описание услуг" },
		whyWe: { type: String, default: "Почему мы" },
		be: { type: String, default: "Be" },
		tg: { type: String, default: "Tg" },
		vk: { type: String, default: "VK" },
		inst: { type: String, default: "Instagram" },
		fb: { type: String, default: "facebook" },
		pin: { type: String, default: "Pin" },
		twit: { type: String, default: "Twit" },
		youtube: { type: String, default: "Youtube" },
		advantages: [
			{
				title: { type: String, default: "Преимущества" },
				icon: { type: String, default: "иконка" },
			},
		],
	},
	{ versionKey: false, timestamps: true },
)

const homeModel = model<IHomeModel>("Home", homeSchema)
export default homeModel
