<template>
  <div class="login-main">
    <q-card
      class="login-form"
      @keyup.enter="doLogin"
    >
      <q-card-section class="headerSection">
        Sign in
      </q-card-section>
      <q-card-section>
        <q-input
          filled
          v-model="login"
          label="Login"
          counter
          maxlength="40"
          :rules="[v=>isValid(v)||`Please use minimum 3 characters`]"
          dense
          autofocus
        >
          <template #before>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input
          filled
          v-model="password"
          label="Password"
          counter
          maxlength="40"
          :rules="[v=>isValid(v)||`Please use minimum 3 characters`]"
          :type="isPwd ? 'password' : 'text'"
          dense
        >
          <template #before>
            <q-icon name="lock" />
          </template>
          <template #append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-separator />
      <q-card-actions align="center">
        <div class="signIn">
          <a class="signIn-a" @click="registerShow=true">register new</a>
        </div>
        <q-btn
          :disable="!isValidAll"
          class="login-button"
          label="Login"
          @click="doLogin"
        />

      </q-card-actions>
    </q-card>
    <q-dialog v-model="registerShow">
      <Register-form :close="()=>registerShow=false"/>
    </q-dialog>
  </div>
</template>

<script setup>

import { onMounted, ref } from 'vue'

import { useRouter } from 'vue-router'
import { defaultRoute } from 'src/router/routes'
import RegisterForm from 'src/components/RegisterForm.vue'
import { errorToast } from 'src/api/toast'
import { useAfStore } from 'stores/antifreeze'
const router = useRouter()
const store = useAfStore()
const login = ref('')
const password = ref('')
const isPwd = ref(true)
const registerShow = ref(false)

function isValid (val) {
  return val.length >= 3
}
function isValidAll () {
  return isValid(password.value) && isValid(login.value)
}

async function doLogin () {
  if (isValidAll()) {
    if (await store.loginAct({ login: login.value, password: password.value })) {
      await store.whoAmiAct()
      await router.push(defaultRoute)
      return
    }
  }
  errorToast('input error, check login/password')
}

onMounted(async () => {
  const ami = await store.whoAmiAct()
  if (ami) {
    await router.push(defaultRoute)
  }
})

</script>

<style lang="scss" scoped>
$headerColor:#e1e1e1;
.login {
  &-main{
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  &-form{
    width: 400px;
    height: min-content;
    margin-top:20px
  }
  &-button{
    width: 100%;
    color: $headerColor;
    background-color: #5c5a5a!important;
  }
}
.headerSection{
  background-color: #5c5a5a;
  color: $headerColor;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 20px;
  justify-content: center;
}
.signIn{
  padding-bottom: 10px;
  &-a{
    font-size: 16px;
    cursor: pointer;
    color: #1680d7;
    font-variant: all-petite-caps;
  }
  &-a:hover{
    color: #0d47a1;
  }
}
</style>
