<template>
    <main>
        <form @submit.prevent="registration">
            <h1>Регистрация</h1>

            <h4>Фамилия</h4>
            <input type="text" placeholder="Укажите фамилию" v-model="userinfo.surname" required>

            <h4>Имя</h4>
            <input type="text" placeholder="Укажите имя" v-model="userinfo.name" required>

            <h4>Логин</h4>
            <input type="text" placeholder="Укажите логин" v-model="userinfo.login" required>

            <h4>Пароль</h4>
            <input type="password" placeholder="Укажите пароль" v-model="userinfo.password" required>

            <h4>Подтверждение пароля</h4>
            <input type="password" placeholder="Повторите пароль" v-model="checkpassword" required>

            <p class="error_message">{{ messages.error }}</p>
            <p class="success_message">{{ messages.success }}</p>

            <input type="submit" value="Зарегистрироваться">

        </form>
    </main>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            userinfo: {
                login: '',
                password: '',
                surname: '',
                name: '',
            },
            checkpassword: '',
            messages: {
                error: '',
                success: '',
            }
        }
    },
    methods: {
        async registration() {
            if (this.userinfo.password == this.checkpassword) {
                await axios.post('/api/registration', this.userinfo)
                    .then((result) => {
                        this.messages.error = ''
                        this.messages.success = result.data
                    })
                    .catch((err) => {
                        this.messages.error = err.response.data
                        this.messages.success = ''
                    })

            } else {
                this.messages.success = ''
                this.messages.error = 'Ошибка! Пароли не совпадают.'
            }
        }
    },
}
</script>

<style scoped>
main{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>