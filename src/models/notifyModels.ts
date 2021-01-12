import mongoose, { model, Schema, Document } from "mongoose"

interface IKey {
	auth: string
	p256dh: string
}
export interface INotify {
	_id?: string
	endpoint: string
	expirationTime: string
	keys: IKey
}
export type INotifyModel = INotify & Document

const notifySchema = new Schema<INotify>(
	{
		endpoint: { type: String, default: null },
		expirationTime: { type: String, default: null },
		keys: {
			auth: { type: String, default: null },
			p256dh: { type: String, default: null },
		},
	},
	{ versionKey: false, timestamps: true },
)

const notifyModel = model<INotifyModel>("Notify", notifySchema)
export default notifyModel
