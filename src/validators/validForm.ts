import { body } from "express-validator"

export const validRegist = [
	/* body("fullname", "Введите Имя и Фамилию...")
		.isString()
		.isLength({
			min: 2,
			max: 40,
		})
		.withMessage("Минимальная длинна поля 2 символа!"), */
	body("login", "Введите Логин...")
		.isString()
		.isLength({
			min: 2,
			max: 16,
		})
		.withMessage("Минимальная длинна Логина 4 символа!"),
	body("email", "Введите Почту...")
		.isString()
		.isEmail()
		.withMessage("Неверный формат Почты!"),
	body("password", "Введите Пароль...")
		.isString()
		.isLength({
			min: 6,
			max: 100,
		})
		.withMessage("Минимальная длинна Пароля 6 символов!"),
]
