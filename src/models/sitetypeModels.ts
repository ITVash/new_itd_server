import mongoose, { model, Schema, Document } from "mongoose"

export interface ISiteType {
	_id?: string
	title?: string
	desc?: string
	icon?: string
	example?: string[]
}
export type ISiteTypeModel = ISiteType & Document

const sitetypeSchema = new Schema<ISiteType>(
	{
		title: { type: String, default: "Заголовок" },
		desc: { type: String, default: "текст" },
		icon: { type: String, default: "" },
		example: [{ type: String, default: "" }],
	},
	{ versionKey: false, timestamps: true },
)

const sitetypeModel = model<ISiteTypeModel>("SiteType", sitetypeSchema)
export default sitetypeModel
