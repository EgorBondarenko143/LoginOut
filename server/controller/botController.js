const express = require('express')

const router = express.Router()

const bcrypt = require('bcryptjs')//Пакет для хеширования паролей

const jwt = require('jsonwebtoken') // Пакет для генерации токена

const TelegramApi = require('node-telegram-bot-api') //Пакет для работы с Api BOT

const ncp = require('copy-paste') //Пакет для копирования информации в буфер обмена на сервере

const fs = require('fs')

const { SECRET_RECOVERY_KEY, SECRET_IDENTIFICATION_KEY, dirname_server } = require('../config')

const { buttonForCopyToken, buttonForPassword, buttonToStartGuessing, buttonsForPlayerGuesser, buttonsForMusic } = require('./keyBoards')





router.post('/', (req, res) => {
    const { login } = req.body
    const SQL_QUERY = `SELECT * FROM users_list WHERE login='${login}' `
    connectionDB.query(SQL_QUERY, async (err, result) => {
        if (err) { res.status(500).send('База данных не доступна') }
        else {
            if (result.length == 0) { res.status(400).send('Логин не найден') }
            else {
                const USER = result[0]
                if (!USER.recovery_token) { res.status(501).send('Данная учётная запись не была связана с Telegram Ботом') }
                else {
                    const { chatId, identificationToken } = jwt.verify(USER.recovery_token, SECRET_RECOVERY_KEY)
                    const { login } = jwt.verify(identificationToken, SECRET_IDENTIFICATION_KEY)
                    currentLogin = login

                    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/c2b/583/c2b583cc-71f2-3f42-935b-9a9c7ac16fc5/43.webp')
                    await bot.sendMessage(chatId, `Здравствуйте, с вашей учётной записи "${login}" прилетел запрос на восстановления пароля!`)
                    await bot.sendMessage(chatId, '!!! ЕСЛИ ВЫ НЕ ОТПРАВЛЯЛИ ЭТОТ ЗАПРОС ТО ПРОСТО ПРОИГНОРИРУЙТЕ ЭТО СООБЩЕНИЕ !!!')
                    setTimeout(async () => { await bot.sendMessage(chatId, `Если это были вы то пожалуйста напишите новый пароль для вашего аккаунта`) }, 3500)

                    currentTopic = `Восстановление пароля`

                    res.status(200).send('Сообщение о восстановлении пароля отправлено вам в Telegram')



                }
            }
        }
    })
})

module.exports = router


const connectionDB = require('./connectionDB')




//Токен настройки бота
const BOT_TOKEN = '7595348177:AAFrYn7yZhJnF-kM_XflbjSWe9hsxHBHyNs'
//Создаём экземпляр бота
const bot = new TelegramApi(BOT_TOKEN, { polling: true })

//Переменные
let currentTopic = '' //Текущая тема разговора
let recoveryToken = '' //Токен восстановления
let newPassword = '' //Новый пароль который прилетит от бота
let currentLogin = ''
let guesser = {
    left: 1,
    right: 1001,
    resultNumber: 0,
    attemps: 0,
}

//Функция генерации токена восстановления
function generateRecoveryToken(chatId, identificationToken) {
    const payload = { chatId, identificationToken }
    return jwt.sign(payload, SECRET_RECOVERY_KEY)
}

//Функции по запуску и настройке бота
function startBot() {
    {
        bot.setMyCommands([
            { command: '/start', description: 'Познакомиться! /// Hello!' },
            { command: '/getinfo', description: 'Получить ID чата /// Get chat ID' },
            { command: '/getrecoverytoken', description: 'Получить токен восстановления /// Get recovery token' },
            { command: '/guess', description: 'Загадай число а я попробую угадать! /// Guess your number and i will try to guess it!' },
            { command: '/music', description: 'Хочешь послушать музыка? /// Wanna listen some music?' },
        ])
    }

    bot.on('message', async (msg) => {
        const message = msg.text
        const chatId = msg.chat.id

        if (message == '/start') {
            return await bot.sendMessage(chatId, `Привет! Я бот по восстановлению пароля!\nHello! I am your password recovery assistant!`)
        }

        if (message == '/getinfo') {
            return await bot.sendMessage(chatId, chatId)
        }

        if (message == '/getrecoverytoken') {
            currentTopic = 'Создание токена восстановления'
            return await bot.sendMessage(chatId, "Для создания уникального токена восстановления, пожалуйста укажите ваш токен идентификации!\nTo create a unique recovery token, please paste your identification token!")
        }

        if (message == '/guess') {
            currentTopic = 'Угадываю число'
            await bot.sendMessage(chatId, "Спорим, что я угадаю твоё число за 10 попыток?")
            await bot.sendMessage(chatId, "Загадай число от 1 до 1000")
            setTimeout(() => { bot.sendMessage(chatId, "Готов?", buttonToStartGuessing) }, 1500)
            return
        }
        if (message == '/music') {
            currentTopic = 'Подбираю музыку'
            await bot.sendMessage(chatId, "Давай послушаем музыку!")
            return await bot.sendMessage(chatId, 'Какаое у вас настроение?', buttonsForMusic )
        }

        //Проверка по теме разгвоора  Тема = Создание токена восстановления 
        if (currentTopic == 'Создание токена восстановления') {
            //Генерация токена..
            currentTopic = ''

            //Пользователь присылает токен идентификации  (в message)
            recoveryToken = generateRecoveryToken(chatId, message)
            await bot.sendMessage(chatId, 'Ваш токен восстановления\nYour recovery token is:  ' + recoveryToken, buttonForCopyToken)
            return await bot.sendMessage(chatId, "Укажите данный токен для восстановления в личном кабинете для восстановления пароля в будущем!\nPaste this recovery token in your personal account to recover your password in the future!")
        }
        // Тема = Восстановление пароля
        if (currentTopic == 'Восстановление пароля') {


            newPassword = message
            return await bot.sendMessage(chatId, `Ваш новый пароль: "${newPassword}". Верно?`, buttonForPassword)

        }







        return await bot.sendSticker(chatId, 'https://cdn.tlgrm.ru/stickers/898/46d/89846db1-5cd7-4d7c-8843-e1932c3c353b/9.webp')
            .then(() => (bot.sendMessage(chatId, 'Неизвестная команда..\nUnknown command..')))
    })

    //Реакция на телеграм кнопки
    bot.on('callback_query', async (msg) => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data == 'copyToken') {
            ncp.copy(recoveryToken, async () => { return await bot.sendMessage(chatId, 'Токен копирован. Удачного пользования!\nToken has been copied to your clipboard!') })
        }
        // Тема = Восстановление пароля
        if (currentTopic == 'Восстановление пароля') {
            if (data == 'passIsCorrect') {
                //Хешируем новый пароль
                const hashPass = bcrypt.hashSync(newPassword, 5)
                const SQL_QUERY = `UPDATE users_list SET password = '${hashPass}' WHERE users_list.login = '${currentLogin}' `

                connectionDB.query(SQL_QUERY, (err, result) => {
                    if (err) { bot.sendMessage(chatId, `База данных недоступна!`) }
                    else { bot.sendMessage(chatId, `Пароль обновлён успешно!`) }
                })

                currentTopic = ''
            }
            if (data == 'passIsWrong') {
                bot.sendMessage(chatId, "В таком случае введите пароль ещё раз")
            }

            if (data == 'cancellRecovery') {
                bot.sendMessage(chatId, "Отлично! В таком случае удачного пользования!")
                currentTopic = ''
            }
        }


        //Тема разговора равна - Угадываю число
        if (currentTopic == 'Угадываю число') {

            if (data == 'startGuessing') {
                guesser.resultNumber = Math.floor((guesser.right - guesser.left) / 2)
                guesser.attemps++
                return bot.sendMessage(chatId, `Окей начинаем! Твоё число ${guesser.resultNumber}?`, buttonsForPlayerGuesser)
            }
            if (data == 'finish_guesser') {
                return bot.sendMessage(chatId, `Отлично!\nМои попытки: ${guesser.attemps}, Твоё число: ${guesser.resultNumber} `)
                    .then(() => {
                        currentTopic = ''
                        guesser = { left: 1, right: 1001, resultNumber: 0, attemps: 0, }
                    })
            }
            if (data == 'less_guesser') {
                guesser.right = guesser.resultNumber
                let middle = Math.floor((guesser.right - guesser.left) / 2)
                guesser.resultNumber = guesser.left + middle
                guesser.attemps++
                if (guesser.attemps == 10) {
                    return bot.sendMessage(chatId, `Отлично!\nМои попытки: ${guesser.attemps}, Твоё число: ${guesser.resultNumber} `)
                        .then(() => {
                            currentTopic = ''
                            guesser = { left: 1, right: 1001, resultNumber: 0, attemps: 0, }
                        })
                }
                return bot.sendMessage(chatId, `Твоё число ${guesser.resultNumber}?`, buttonsForPlayerGuesser)
            }
            if (data == 'more_guesser') {
                guesser.left = guesser.resultNumber
                let middle = Math.floor((guesser.right - guesser.left) / 2)
                guesser.resultNumber = guesser.left + middle
                guesser.attemps++
                if (guesser.attemps == 10) {
                    return bot.sendMessage(chatId, `Отлично!\nМои попытки: ${guesser.attemps}, Твоё число: ${guesser.resultNumber} `)
                        .then(() => {
                            currentTopic = ''
                            guesser = { left: 1, right: 1001, resultNumber: 0, attemps: 0, }
                        })
                }
                return bot.sendMessage(chatId, `Твоё число ${guesser.resultNumber}?`, buttonsForPlayerGuesser)
            }
            if (data == 'stopGuessing') {
                return bot.sendMessage(chatId, 'Хорошо, игра остановлена.').then(() => {
                    currentTopic = ''
                    guesser = { left: 1, right: 1001, resultNumber: 0, attemps: 0, }
                })
            }
        }

        //Тема == слушаем музыку
        if(currentTopic == 'Подбираю музыку'){
        
        const url = dirname_server + '/static/music/' + data
        const songs = fs.readdirSync(url)
        const random =  Math.round(Math.random() * (songs.length - 1) + 1) - 1;
        bot.sendMessage(chatId, 'Вот ваша музыка наслаждайтесь! (Возможно вам придётся чуть-чуть подождать)')
        bot.sendAudio(chatId, url+'/'+songs[random])
        
        }
    })






}


//Запуск бота
startBot()