<template>
    <main>

        <h2>Общий чат</h2>

        <section class="history__messages">
            <!-- Animations -->
            <transition-group name="messages__list">
                <article v-for="(item) in messages" :key="item">
                    <div class="message__photo">{{ item.sender_id }}</div>
                    <div class="message__body">
                        <header class="message__header">
                            <div class="message__login">{{ item.sender_login }}</div>
                            <div class="message__date">{{ item.date }}</div>
                        </header>
                        <div class="message__text">{{ item.message }}</div>
                    </div>

                </article>
            </transition-group>


            <p v-if="messages.length == 0">Пока что здесь нет сообщений</p>
        </section>

        <textarea placeholder="Напиши сообщение" v-model="message_value"
            @keydown.enter.prevent="sendMessage"></textarea>

    </main>
</template>

<script>
import axios from 'axios';
import { io } from 'socket.io-client'

export default {
    data() {
        return {
            USER_INFO: {},
            message_value: '',
            messages: [],
            socket: null,
        }
    },
    mounted() {
        this.checkAuth()

        this.socket = io('') // Подключение к веб-сокет серверу по стандартному пути

        // Обработка сообщение от сервера..
        this.socket.on('message', (data) => {
            if (data.hasOwnProperty('sender_id')) {
                this.messages.unshift(data)
                if (data.sender_id != this.USER_INFO.id) {
                    const notification = new Audio()
                    notification.src = '../../public/notif.mp3'
                    notification.play()
                }
            } else {
                console.error(data)
            }
        })
    },
    methods: {
        async sendMessage() {
            document.querySelector('.history__messages').scrollTo(0, 0)
            if (this.message_value) {
                await axios.post('/api/sendMessage', { message: this.message_value, sender_id: this.USER_INFO.id, sender_login: this.USER_INFO.login })
                    .then((result) => { this.message_value = '' })
                    .catch((error) => { console.error(error); })
            }
        },
        async checkAuth() {
            await axios.post('/api/authorization')
                .then((result) => { this.USER_INFO = result.data[0] })
                .catch((err) => {
                    console.error('Ошибка авторизации...')
                    this.$router.push('/auth')

                })

        },
    },
    beforeDestroy() {
        //Отключаемся от сокета при уходе с компонента
        if (this.socket) { this.socket.disconnect() }
    },
}
</script>

<style scoped>
main {
    width: 100%;
    height: 100%;
    color: rgb(214, 183, 98);
}

.history__messages {
    height: 60vh;
    margin: 10px 0;
    padding: 10px;

    display: flex;
    flex-direction: column-reverse;
    gap: 8px;

    overflow: auto;
}



.history__messages article {
    height: auto;
    display: flex;
    width: 60%;
}

.message__photo {
    height: 70px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    margin-right: 10px;

    background-color: rgb(0, 0, 0);

    display: flex;
    justify-content: center;
    align-items: center;
}

.message__body {
    width: 100%;
    background-color: rgb(45, 45, 45);
    border-radius: 5px 20px 20px 20px;
}

.message__login {
    color: peachpuff;
}

.message__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    font-size: 15px;
}

.message__text {
    padding: 10px 20px;
}

.message__ .message_text {

    padding: 10px 20px;
    flex-grow: 1;

    background-color: rgb(45, 45, 45);
}

textarea {
    width: 100%;
    padding: 20px;
    font-size: 16px;
    border: 0;
    border-radius: 20px;

    background-color: rgb(84, 83, 85);
    color: white;
    resize: none;
}

textarea:focus {
    outline: 0;
}

/* Messages  animation */
.messages__list-move,
.messages__list-enter-active,
.messages__list-leave-active {
    transition: all 1s ease;
}

.messages__list-enter-from,
.messages__list-leave-to {
    opacity: 0;
    transform: translateX(40px);
}
</style>