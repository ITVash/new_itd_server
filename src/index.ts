import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import bodyParser from "body-parser"
import "./core/db"
import createRoutes from "./core/routes"
import { passport } from "./core/passport"
import https from "https"
import fs from "fs"

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/upload", express.static("upload"))
app.use(passport.initialize())
createRoutes(app)

const opt = {
	key: fs.readFileSync("/home/itd.company/conf/web/ssl.api.itd.company.key"),
	cert: fs.readFileSync("/home/itd.company/conf/web/ssl.api.itd.company.crt"),
	ca: fs.readFileSync("/home/itd.company/conf/web/ssl.api.itd.company.ca"),
}

const serv = new https.Server(opt, app)
const host: string = "192.168.0.76"

const PORT: number = Number(process.env.PORT) || 5051

/* app.listen(PORT, (): void => {
	console.log(`Сервер запущен по адрессу: http://localhost:${PORT}`)
}) */

serv.listen(PORT, host, () => {
	console.log(`Сервер запущен по адресу: http://${host}:${PORT}`)
	//console.log('Адресс: ', serv.address().address)
})
serv.on("listening", () => {
	const address = serv.address()
	console.log("Listen: ", address)
})
