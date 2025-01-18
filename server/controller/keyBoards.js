module.exports = {
    buttonForCopyToken: {
        reply_markup: JSON.stringify({
            inline_keyboard: [[{
                text: 'Скопировать токен восстановления   ///   Сopy recovery token',
                callback_data: 'copyToken'
            }]]
        })
    },
    buttonForPassword: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Пароль правильный', callback_data: 'passIsCorrect' }, {
                    text: 'В пароле есть ошибка', callback_data: 'passIsWrong'
                }],
                [{
                    text: 'Я вспомнил свой пароль, не надо его менять!', callback_data: 'cancellRecovery'
                }],
            ]
        })
    }
}