const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')//Пакет для хеширования паролей
const jwt = require('jsonwebtoken') // Пакет для генерации токена
const connectionDB = require('./connectionDB')

//
const {SECRET_IDENTIFICATION_KEY} = require('../config')

function generateIdnetificationToken(login, hashPass){
    const payload = {
        login, hashPass
    }
    return jwt.sign(payload, SECRET_IDENTIFICATION_KEY)
}


//Реакция на registration
router.post('/', (request, response) => {
    //Достаём данные из запроса
    const { login, password, surname, name } = request.body

    // проверка на существование данного логина
    const checkQuery = `SELECT * FROM users_list WHERE login = '${login}'`

    connectionDB.query(checkQuery, (err, result) => {
        //Проверяем на наличие ошибок
        if (err) { response.status(500).send('База данных не доступна') }
        //Ошибок нет? Идём дальше!
        else {

            //Если результат больше 0 то логин занят
            if (result.length > 0) {
                response.status(501).send('Данный логин уже занят')
            }
            //Если результат пустой, то выполняем регистрацию
            else {

                const salt = bcrypt.genSaltSync(5) //Генирируем соль
                const hashPass = bcrypt.hashSync(password, salt) //Хешируем пароль

                const registrationQuery = `INSERT INTO users_list (id, login, password, surname, name, identification_token)
                     VALUES (NULL, '${login}', '${hashPass}', '${surname}', '${name}', '${generateIdnetificationToken(login, hashPass)}')`

                connectionDB.query(registrationQuery, (err, result) => {
                    if (err) { response.status(500).send(err) }
                    else { response.status(200).send('Регистрация выполнена!') }
                })
            }
        }
    })
})

module.exports = router