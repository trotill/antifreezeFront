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
        <q-btn
          :disable="!isValidAll"
          class="login-button"
          label="Login"

          @click="doLogin"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>

import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { defaultRoute } from '../router/routes.js'
const router = useRouter()

const $q = useQuasar()
const store = useStore()
const login = ref('')
const password = ref('')
const isPwd = ref(true)

function isValid (val) {
  return val.length >= 3
}
function isValidAll () {
  return isValid(password.value) && isValid(login.value)
}

async function doLogin () {
  if (isValidAll()) {
    if (await store.dispatch('login', { login: login.value, password: password.value })) {
      router.push(defaultRoute)
    }
  } else {
    $q.notify({ message: 'input error, check login/password', type: 'negative' })
  }
}

onMounted(async () => {
  const ami = await store.dispatch('whoAmi')
  if (ami) {
    router.push(defaultRoute)
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
  padding: 0px;
  display: flex;
  align-items: center;
  font-size: 20px;
  justify-content: center;
}
</style>
