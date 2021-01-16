import mongoose, { model, Schema, Document } from "mongoose"

export interface IService {
	_id?: string
	background?: string
	title?: string
	subService?: Schema.Types.ObjectId | Record<string, unknown>[]
}
export type IServiceModel = IService & Document

const serviceSchema = new Schema<IService>(
	{
		background: { type: String, default: "" },
		title: { type: String, default: "Заголовок" },
		subService: [{ type: Schema.Types.ObjectId, ref: "SubService" }],
	},
	{ versionKey: false, timestamps: true },
)

const serviceModel = model<IServiceModel>("Service", serviceSchema)
export default serviceModel
