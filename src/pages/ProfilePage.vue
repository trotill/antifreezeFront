<template>
<div class="profileMain" v-show="readyShow">
  <div class="userInfo q-mb-lg" >
    <div class="userInfoHeader" >About you</div>
    <Input class="userInfoItem" :key="idx" :readonly="true" :label="userInfo[0]" :modelValue="userInfo[1]" v-for="(userInfo,idx) in userInfoList"/>
  </div>
  <q-table
    v-if="store.whoAmi.group==='admin'"
    class="userListTableSize q-mb-lg"
    title="User list"
    card-class="tableUserMain"
    dark
    :rows="tabData"
    :columns="tabCol"
    row-key="name"
  >
    <template v-slot:body-cell-disable="item">
      <td class="text-left">
        <q-toggle :disable="store.whoAmi.login===item.row.login" :model-value="item.value" @update:model-value="(state)=>toggleDisableUser(item,state)" />
      </td>
    </template>
    <template v-slot:body-cell-group="item">
      <td class="text-left">
        <q-toggle
          :disable="store.whoAmi.login===item.row.login"
          :model-value="item.value"
          false-value="user"
          true-value="admin"
          color="amber-10"
          @update:model-value="(state)=>toggleGroupUser(item,state)"
        />
      </td>
    </template>
    <template v-slot:body-cell-edit="item">
      <td class="text-left">
        <q-btn  round color="amber-10" size="sm" icon="edit" @click="showUserProfile(item)"/>
      </td>
    </template>
  </q-table>
  <q-btn v-if="store.whoAmi.group!=='admin'" class="changePrivateBtn controlButtonSize" color="grey-10" label="Edit user data" @click="registerShow=true" />
  <q-btn class="logoutBtn controlButtonSize" color="grey-10" label="Logout" @click="logoutClick"/>

  <q-dialog v-model="registerShow">
    <Register-form :close="closeRegisterDialog" :create="false" :default-data="editedUser"/>
  </q-dialog>
</div>
</template>

<script setup>

import RegisterForm from 'src/components/RegisterForm.vue'
import Input from 'src/components/Input.vue'
import { onMounted, ref, reactive } from 'vue'
import rest from 'src/api/http/route'

import { errorToast } from 'src/api/toast'
import { useAfStore } from 'stores/antifreeze'
const store = useAfStore()
const registerShow = ref(false)
const editedUser = reactive({
  firstName: '',
  lastName: '',
  email: '',
  login: ''
})
const tabCol = [{
  name: 'login',
  required: true,
  label: 'Login',
  align: 'left',
  field: 'login',
  sortable: true
},
{
  name: 'disable',
  required: true,
  label: 'Disable',
  align: 'left',
  field: 'disable',
  sortable: true
},
{
  name: 'group',
  required: true,
  label: 'Admin',
  align: 'left',
  field: 'group',
  sortable: true
},
{
  name: 'edit',
  label: '',
  align: 'left',
  field: 'edit'
}]

const userList = ref([])
const readyShow = ref(false)
const tabData = ref([])
const userInfoList = ref([])
function logoutClick () {
  localStorage.setItem('access', null)
  localStorage.setItem('refresh', null)
  location.reload()
}
async function closeRegisterDialog () {
  registerShow.value = false
  await requestUserData()
}
async function showUserProfile (item) {
  const { login } = item.row
  const found = userList.value.find(({ login: loginPtr }) => login === loginPtr)
  if (found) {
    editedUser.email = found.email
    editedUser.firstName = found.firstName
    editedUser.lastName = found.lastName
    editedUser.login = login
    registerShow.value = true
  }
}
async function toggleDisableUser (item, state) {
  for (const tabDataItem of tabData.value) {
    const { login, disable } = tabDataItem
    let newDisable = disable
    if (login === item.row.login) {
      newDisable = state
      const result = await rest.changeUser({ disable: state, login })
      if (result.statusText) {
        errorToast('Error change disable status')
      }
    }
    tabDataItem.disable = newDisable
  }
}
async function toggleGroupUser (item, state) {
  for (const tabDataItem of tabData.value) {
    const { login, group } = tabDataItem
    let newGroup = group
    if (login === item.row.login) {
      newGroup = state
      const result = await rest.changeUserGroup({ group: state, login })
      if (result.statusText) {
        errorToast('Error change user group')
      }
    }
    tabDataItem.group = newGroup
  }
}

async function requestUserData () {
  let srcUserInfo
  if (store.whoAmi.group === 'admin') {
    const result = await rest.getUserList()
    if (!result?.meta) {
      errorToast('Error get user list')
    } else {
      userList.value = result.data
      tabData.value = result.data.map(({ login, disable, group }) => (
        {
          login,
          disable,
          group
        }))
      srcUserInfo = userList.value.find(({ login }) => login === store.whoAmi.login)
    }
  } else {
    const result = await rest.getUser()
    if (!result?.meta) {
      errorToast('Error get user info')
    } else {
      const { email, firstName, lastName, login } = result.data
      srcUserInfo = result.data
      editedUser.email = email
      editedUser.firstName = firstName
      editedUser.lastName = lastName
      editedUser.login = login
    }
  }
  userInfoList.value = []
  userInfoList.value.push(['login', srcUserInfo.login])
  userInfoList.value.push(['group', srcUserInfo.group])
  userInfoList.value.push(['name', `${srcUserInfo.firstName} ${srcUserInfo.lastName}`])
  userInfoList.value.push(['email', srcUserInfo.email])
}
onMounted(async () => {
  await requestUserData()
  readyShow.value = true
})
</script>

<style lang="scss" scoped>
@import "src/css/main";
.profileMain{
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  width: 100%;
  align-items: center;
}
.changePrivateBtn{
  margin-bottom: 20px;
}
.userListTableSize{
  width: $profileElementWidth;
}
.userInfo{
  width:$profileElementWidth;
  background-color: #323232;
  border-radius: 3px;
  font-size: 18px;
  color: #9b9b9b;
  text-align: left;
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
}
.userInfoItem{
  border-style: solid;
  border-width: 1px;
  margin: 5px;
  border-radius: 3px;
}
.userInfoHeader{
  font-size: 20px;
  border-radius: 3px 3px 0 0;
  color: white;
  padding:5px;
  text-align: center;
  background-color: #1b1b1b;
}
.tableUserMain{
  background-color: #333333;
  color: #ffffff;
}
</style>
