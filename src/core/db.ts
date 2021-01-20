import mongoose from "mongoose"

//mongodb+srv://admin:dtkjcbgtl2020@dontrc.4b9is.gcp.mongodb.net/itdcompany?retryWrites=true&w=majority
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
