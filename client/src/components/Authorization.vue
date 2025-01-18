<template>
    <main>
        <form @submit.prevent="authorization">
            <h1>Авторизация</h1>

            <h4>Логин</h4>
            <input type="text" placeholder="Укажите логин" v-model="userinfo.login" required>

            <h4>Пароль</h4>
            <input type="password" placeholder="Укажите пароль" v-model="userinfo.password" required>

            <p class="error_message">{{ messages.error }}</p>
            <p class="success_message">{{ messages.success }}</p>
            <p class="warn__message" @click="recoveryPass">Забыли пароль?</p>

            <input type="submit" value="Авторизация">
        </form>

    </main>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            userinfo: {
                login: '',
                password: '',
            },
            messages: {
                error: '',
                success: ''
            }
        }
    },
    mounted() {
        if (document.cookie.split('=')[1] != '') { this.authorization() }
    },
    methods: {
        async authorization() {
            await axios.post('/api/authorization', this.userinfo)
                .then((result) => {
                    this.messages.error = ''
                    this.messages = 'Успех!'
                    this.$emit('updateUser')
                    this.$router.push('/account')
                })
                .catch((err) => {
                    this.messages.success = ''
                    console.log(err)
                    this.messages.error = 'Ошибка! ' + err.response.data
                })
        },
        async recoveryPass() {
            if (this.userinfo.login) {
                await axios.post('/api/recoveryPass', { login: this.userinfo.login })
                    .then((result) => {
                        this.messages.error = ''
                        this.messages.success = 'Успешно! ' + result.data
                    }) 
                    .catch((err) => {
                        this.messages.error = 'Ошибка! ' + err.response.data
                        this.messages.success = ''
                    })
            } else {
                this.messages.error = 'Укажите логин для восстановления пароля'
            }
        }
    }
}
</script>

<style scoped>
main {
    display: flex;
    justify-content: center;
    align-items: center;
}

.warn__message {
    color: #ffa500;
    cursor: pointer;
    user-select: none;
}
</style>