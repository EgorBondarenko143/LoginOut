<template>
    <main>
        <header>
            <h2>Личный кабинет</h2>
            <button @click="logout">Выйти из аккаунта</button>
        </header>
        <h3>Пользователь: {{ USER_INFO.surname }}, {{ USER_INFO.name }}</h3>
        <p>ID: {{ USER_INFO.id }}</p>
        <p>Роль: {{ USER_INFO.role }}</p>

        <div class="recoveryPass">
            <div class="recoveryPass__left">
                <button @click="copyidentificationToken">Скопировать токен идентификации</button>
                <a class="likeButton" href="https://web.telegram.org/k/#@PasswordRecoverySystem_bot"
                    target="_blank">Открыть бота</a>
                <p>Восстановление пароля производится при помощи Telegram BOT</p>
                <h3>Инструкция:</h3>
                <ol>
                    <li>Скопируйте токен идентификации</li>
                    <li>Укажите его в Боте</li>
                    <li>Бот идентифицирует вас и сгенерирует токен восстановления</li>
                    <li>Укажите токен восстановления в поле справа</li>
                </ol>
            </div>
            <div class="recoveryPass__right">
                <input type="text" placeholder="Токен восстановления от бота" v-model="recoveryToken">
                <button @click="updateRecoveryToken">Обновить токен восстановления</button>
                <p>Ваш текущий токен:</p>
                <p>{{ String(USER_INFO.recovery_token).slice(0, 40) }}...</p>
            </div>
        </div>
    </main>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            USER_INFO: {},
            recoveryToken: ''
        }
    },
    mounted() {
        this.checkAuth()
    },
    methods: {
        async checkAuth() {
            await axios.post('/api/authorization')
                .then((result) => { this.USER_INFO = result.data[0] })
                .catch((err) => {
                    console.error('Ошибка авторизации...')
                    this.$router.push('/auth')

                })

        },
        logout() {
            document.cookie = 'ACCESS_TOKEN='
            this.$emit('updateUser')
            this.$router.push('/auth')
        },
        copyidentificationToken() {
            navigator.clipboard.writeText(this.USER_INFO.identification_token)
            alert('Токен индефикации скопирован!')
        },
        async updateRecoveryToken() {
            if (this.recoveryToken) {
                if (confirm('Вы уверены, что хотите обновить токен востановления?')) {
                    const recovery_data = {
                        userId: this.USER_INFO.id,
                        recoveryToken: this.recoveryToken
                    }
                    this.recoveryToken = ''
                    await axios.post('/api/updateRecoveryToken', recovery_data)
                        .then(() => { this.checkAuth() })
                        .catch((err) => { console.error(err) })
                }
            } else {
                alert('Поле токена пустое..')
            }
        }
    },
}
</script>

<style scoped>
main {
    color: whitesmoke;
}

head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button,
.likeButton {
    color: whitesmoke;
    background-color: transparent;
    border: 1px solid whitesmoke;
    font-size: 16px;
    padding: 8px 16px;
    border-radius: 5px;
    transition-duration: 0.5s;
    text-decoration: none;
    text-align: center;
}

button:hover,
.likeButton:hover {
    background-color: black;
    cursor: pointer;
}

.recoveryPass {
    border: 1px solid whitesmoke;
    padding: 20px;
    margin: 20px 0;
    border-radius: 5px;
    display: flex;
    gap: 20px;
    justify-content: space-between;
}

.recoveryPass>div {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.recoveryPass ol {
    margin-left: 20px;
}
</style>