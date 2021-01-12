import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import bodyParser from "body-parser"
//import passport from "passport"
import "./core/db"
import createRoutes from "./core/routes"
import { passport } from "./core/passport"

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/upload", express.static("upload"))
app.use(passport.initialize())
createRoutes(app)

const PORT = process.env.PORT || "3001"
app.listen(PORT, (): void => {
	console.log(`Сервер запущен по адрессу: http://localhost:${PORT}`)
})
