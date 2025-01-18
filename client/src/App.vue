<template>
  <div id="main__wrapper">
    <header id="main__header">
      <h1>LOGO</h1>
      <nav>
        <router-link to="/reg" v-if="!USER_INFO">Регистрация</router-link>
        <router-link to="/auth" v-if="!USER_INFO">Авторизация</router-link>
        <router-link to="/account" v-if="USER_INFO">Личный кабинет</router-link>
      </nav>
    </header>


    <div id="content__wrapper">
      <router-view @updateUser="checkAuth" ></router-view>
    </div>

  </div>
</template>

<script>
import axios from 'axios'


export default {
  data() {
    return {
      USER_INFO: {}
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
          this.USER_INFO
          console.error('Ошибка авторизации...')
          this.$router.push('/auth')

        })
    },
  }
}
</script>

<style>
#main__wrapper {
  width: 100%;
  height: 100%;
  background-color: rgb(37, 37, 37);
}

#main__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 3%;
  border-bottom: 1px solid orange;
}

#main__header nav {
  display: flex;
  gap: 20px;
}

#main__header nav * {
  color: whitesmoke;
  text-decoration: none;
}

#content__wrapper {
  padding: 4% 3% 20px 3%;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 40%;
  background-color: whitesmoke;
  padding: 20px;
  border-radius: 10px;
}

input {
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid rgb(186, 186, 1861);
}

input[type='submit'] {
  background-color: orange;
  transition-duration: 0.2s;
  cursor: pointer;
}

input[type='submit']:hover {
  transform: scale(1.04);
}

h1 {
  text-align: center;
  color: orange;
  text-transform: uppercase;
}

.error_message {
  color: red;
}

.success_message {
  color: rgb(20, 144, 20);
}
</style>