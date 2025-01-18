const mysql = require('mysql')//Пакет для работы с mysql БД

//Установливаем соединение с БД
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'RAB',
    user: 'root',
    password: ''
})

module.exports = connection