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
    },

    buttonToStartGuessing: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: 'Готов!', callback_data: 'startGuessing' }, {
                    text: 'Нет спасибо, я передумал', callback_data: 'stopGuessing'
                }],
            ]
        })
    },
    buttonsForPlayerGuesser: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: 'Угадал!', callback_data: 'finish_guesser' }
                ],
                [
                    { text: 'Больше!', callback_data: 'more_guesser' },
                    { text: 'Меньше', callback_data: 'less_guesser' }
                ],
                [
                    { text: 'Давай прекратим игру!', callback_data: 'stopGuessing' },
                ],
            ]
        })
    },
    buttonsForMusic: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: 'Всё отлично!', callback_data: 'perfect_mood' }
                ],
                [
                    { text: 'Средненько', callback_data: 'middle_mood' },
                ],
                [
                    { text: 'Ужасное..', callback_data: 'bad_mood' },
                ],
            ]
        })
    }
}