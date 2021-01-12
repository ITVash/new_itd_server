import mongoose from "mongoose"

const LINK: string = process.env.LINK_DB || "http://localhost:27017/dtrc"
mongoose.connect(LINK, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})

const db = mongoose.connection

db.on("error", console.error.bind(console, "Ошибка подключения к базе данных:"))

export { db, mongoose }
