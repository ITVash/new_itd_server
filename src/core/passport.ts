import passport from "passport"
import { Strategy as localStrategy } from "passport-local"
import { Strategy as VKStrategy } from "passport-vkontakte"
import { Strategy as FBStrategy } from "passport-facebook"
import { OAuth2Strategy as GOStrategy } from "passport-google-oauth"

import {
	Strategy as JWTStrategy,
	ExtractJwt as ExtractJWTS,
} from "passport-jwt"

import userModel, { IUser, IUserModel } from "../models/userModels"
import { generateMD5 } from "../utils/generateHash"

passport.use(
	new localStrategy(
		async (username, password, done): Promise<void> => {
			try {
				const user = await userModel
					.findOne({ $or: [{ email: username }, { login: username }] })
					.exec()
				if (!user) {
					return done(null, false)
				} //generateMD5(password + process.env.SECRET_KEY)
				if (user.password === password) {
					return done(null, user)
				} else {
					return done(null, false)
				}
			} catch (error) {
				return done(error, false)
			}
		},
	),
)
passport.use(
	new VKStrategy(
		{
			clientID: process.env.VK_CLID || "",
			clientSecret: process.env.VK_SEC || "",
			callbackURL: "https://donetskcity.itd.company/api/auth/vk/login",
			profileFields: ["email"],
		},
		async (accessToken, refreshToken, params, profile, done): Promise<void> => {
			try {
				const user = await userModel
					.findOne({ email: profile.emails && profile.emails[0].value })
					.exec()
				if (!user) {
					const obj = {
						login: profile.username || "Аноним",
						email:
							(profile.emails && profile.emails[0].value) ||
							`${profile.id}@dtrc.com`,
						password: generateMD5(String(profile.id) + process.env.SECRET_KEY),
						confirmed_hash: generateMD5(
							process.env.SECRET_KEY + Math.random().toString() ||
								Math.random().toString(),
						),
						phone: "0000000000",
						confirm: true,
						avatar: profile.photos && profile.photos[0].value,
					}
					const userCreate = await userModel.create(obj)
					if (userCreate) {
						return done(null, userCreate)
					}
				} else {
					return done(null, user)
				}
			} catch (error) {
				console.log(error)
			}
		},
	),
)
passport.use(
	new FBStrategy(
		{
			clientID: process.env.FB_CLID || "",
			clientSecret: process.env.FB_SEC || "",
			callbackURL: "https://donetskcity.itd.company/api/auth/fb/login",
			//callbackURL: "http://localhost:5052/api/auth/fb/login",
			profileFields: ["email", "displayName", "photos"],
		},
		async (accessToken, refreshToken, profile, cb): Promise<void> => {
			try {
				const user = await userModel
					.findOne({ email: profile.emails && profile.emails[0].value })
					.exec()
				if (!user) {
					const obj = {
						login: profile.displayName || "Аноним",
						email:
							(profile.emails && profile.emails[0].value) ||
							`${profile.id}@dtrc.com`,
						password: generateMD5(String(profile.id) + process.env.SECRET_KEY),
						confirmed_hash: generateMD5(
							process.env.SECRET_KEY + Math.random().toString() ||
								Math.random().toString(),
						),
						phone: "0000000000",
						confirm: true,
						avatar: profile.photos && profile.photos[0].value,
					}
					const userCreate = await userModel.create(obj)
					if (userCreate) {
						return cb(null, userCreate)
					}
				} else {
					return cb(null, user)
				}
			} catch (error) {
				console.log(error)
			}
		},
	),
)
passport.use(
	"google",
	new GOStrategy(
		{
			clientID: process.env.GOOGLE_CLID || "",
			clientSecret: process.env.GOOGLE_SEC || "",
			callbackURL: "https://donetskcity.itd.company/api/auth/google/login",
			//callbackURL: "http://localhost:5052/api/auth/google/login",
		},
		async (accessToken, refreshToken, profile, done): Promise<void> => {
			try {
				const user = await userModel
					.findOne({ email: profile.emails && profile.emails[0].value })
					.exec()
				if (!user) {
					const obj = {
						login: profile.displayName || `${profile.id}`,
						email:
							(profile.emails && profile.emails[0].value) ||
							`${profile.id}@dtrc.com`,
						password: generateMD5(String(profile.id) + process.env.SECRET_KEY),
						confirmed_hash: generateMD5(
							process.env.SECRET_KEY + Math.random().toString() ||
								Math.random().toString(),
						),
						phone: "0000000000",
						confirm: true,
						avatar: profile.photos && profile.photos[0].value,
					}
					const userCreate = await userModel.create(obj)
					if (userCreate) {
						return done(null, userCreate)
					}
				} else {
					return done(null, user)
				}
			} catch (error) {
				console.log(error)
			}
		},
	),
)
passport.use(
	new JWTStrategy(
		{
			secretOrKey: process.env.SECRET_KEY || "1234321",
			jwtFromRequest: ExtractJWTS.fromHeader("token"),
		},
		async (token: { user: IUser; exp: any }, done) => {
			try {
				if (token.exp * 1000 < Date.now()) {
					done(null, false)
				}
				const user = await userModel.findById(token.user._id).exec()
				if (user) {
					done(null, user)
				}
				//done(null, false)
			} catch (error) {
				done(error, false)
			}
		},
	),
)

passport.serializeUser((user: IUser, done) => {
	done(null, user?._id)
})
passport.deserializeUser((id, done) => {
	userModel.findById(id, (err: any, user: IUser) => {
		done(err, user)
	})
})

export { passport }
