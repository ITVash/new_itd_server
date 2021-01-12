import { model, Schema, Document } from "mongoose"

export interface IUser {
	_id?: string
	fullname?: string
	login: string
	email: string
	confirm?: boolean
	tenant?: boolean
	access?: number
	phone?: string
	confirmed_hash?: string
	password?: string
	avatar?: string
}

const userSchema = new Schema<IUser>(
	{
		fullname: {
			type: String,
			default: "Аноним",
		},
		login: {
			unique: true,
			type: String,
			required: true,
		},
		email: {
			unique: true,
			required: true,
			type: String,
		},
		confirm: {
			type: Boolean,
			default: false,
		},
		tenant: {
			type: Boolean,
			default: false,
		},
		confirmed_hash: {
			type: String,
			unique: true,
			required: true,
		},
		access: {
			type: Number,
			default: 0,
		},
		phone: {
			type: String,
			default: "380719998877",
		},
		password: {
			required: true,
			type: String,
		},
		avatar: {
			type: String,
		},
	},
	{ versionKey: false, timestamps: true },
)

userSchema.set("toJSON", {
	transform: (_: any, ret: any) => {
		delete ret.password
		delete ret.confirmed_hash
		return ret
	},
})
export type IUserModel = IUser & Document
const userModel = model<IUserModel>("User", userSchema)

export default userModel
