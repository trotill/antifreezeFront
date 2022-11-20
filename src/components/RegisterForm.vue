<template>
  <q-card>

    <q-card-section>
      <div class="text-h6">{{(create)?'User registration':'User profile edit'}}</div>
    </q-card-section>

    <q-card-section class="q-gutter-md" @keypress.enter="onClick">
      <div class="q-gutter-md row">
        <q-input
          filled
          v-model="registerNew.firstName"
          label="First name"
          :rules="nameRules"
          ref="firstNameRef"
          lazy-rules
          dense
        />
        <q-input
          filled
          v-model="registerNew.lastName"
          label="Last name"
          :rules="nameRules"
          ref="lastNameRef"
          lazy-rules
          dense
        />
      </div>
      <div class="q-gutter-md row">
        <q-input
          filled
          v-model="registerNew.email"
          label="e-mail"
          lazy-rules
          :rules="emailRules"
          ref="emailRef"
          dense
        />
        <q-input
          filled
          :readonly="!create"
          v-model="registerNew.login"
          label="Login"
          :rules="loginRules"
          ref="loginRef"
          lazy-rules
          dense
        />

      </div>
      <q-separator/>
      <div class="q-gutter-md row">
        <q-input
          filled
          v-model="registerNew.password"
          label="Password"
          type='password'
          lazy-rules
          :rules="passwordRules"
          ref="passwordRef"
          dense
        />
        <q-input
          filled
          v-model="registerNew.passwordCopy"
          label="Copy password"
          type='password'
          lazy-rules
          :rules="passwordRules"
          ref="passwordCopyRef"
          dense
        />
      </div>

    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Submit" type="submit"  flat color="primary"  @click="onClick"/>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import rest from 'src/api/http/route'
import { errorToast } from 'src/api/toast'

const props = defineProps({
  create: {
    type: Boolean,
    default: true
  },
  defaultData: {
    type: Object
  },
  close: {
    type: Function
  }
})

const registerNew = reactive({
  login: props.defaultData?.login ?? '',
  password: '',
  passwordCopy: '',
  firstName: props.defaultData?.firstName ?? '',
  lastName: props.defaultData?.lastName ?? '',
  email: props.defaultData?.email ?? ''
})
const firstNameRef = ref(null)
const lastNameRef = ref(null)
const nameRules = [
  val => (val && val.length > 0) || 'Please type something'
]

const loginRef = ref(null)
const loginRules = [
  val => (val && val.length >= 4) || 'Requires more than 3'
]

const passwordRef = ref(null)
const passwordCopyRef = ref(null)
const passwordRules = [
  val => (val && val.length >= 4) || 'Requires more than 3'
]
const emailRef = ref(null)
const emailRules = [
  val => (val && (val.length >= 2) && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val)) || 'Check email'
]

async function onClick () {
  firstNameRef.value.validate()
  lastNameRef.value.validate()
  emailRef.value.validate()
  passwordCopyRef.value.validate()
  passwordRef.value.validate()
  loginRef.value.validate()
  if ((registerNew.passwordCopy !== registerNew.password)) {
    errorToast('error, passwords must be the same')
    return
  }
  if (firstNameRef.value.hasError ||
    lastNameRef.value.hasError ||
    emailRef.value.hasError ||
    passwordCopyRef.value.hasError ||
    passwordRef.value.hasError ||
    loginRef.value.hasError
  ) {
    errorToast('input error, check data')
  } else {
    const result = await rest[(props.create) ? 'createUser' : 'changeUser']({
      login: registerNew.login,
      password: registerNew.password,
      firstName: registerNew.firstName,
      lastName: registerNew.lastName,
      email: registerNew.email
    })

    if (result.statusText) {
      errorToast(`${result.statusText} (${result.status})`)
    } else {
      props.close()
    }
  }
}
</script>

<style scoped>

</style>
