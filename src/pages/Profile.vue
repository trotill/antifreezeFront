<template>
  <div class="profileMain">
    <q-btn class="logoutBtn controlButtonSize" color="blue-5" label="Logout" @click="logoutClick"/>
    <q-btn class="changePrivateBtn controlButtonSize" color="blue-5" label="Private" />
  </div>
</template>

<script setup>

function logoutClick () {
  localStorage.setItem('access', null)
  localStorage.setItem('refresh', null)
  location.reload()
}
</script>

<style scoped>
.profileMain{
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  width: 100%;
  align-items: center;
}
.changePrivateBtn{
  margin-top: 20px;
}
</style>
