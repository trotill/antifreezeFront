<template>
  <q-layout view="lHh lpR lff">
    <q-header v-if="mobile" elevated class="bg-black">
      <q-toolbar>
        <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
        <q-toolbar-title/>
      </q-toolbar>
    </q-header>
    <q-drawer
      show-if-above
      v-if="leftDrawerOpen"
      side="left"
      dark
      :breakpoint="50"
      :mini="hideLeftSide&&!mobile"
      :width="200"
      @mouseover="hideLeftSide = false"
      @mouseout="hideLeftSide = true"
      :overlay="mobile"
      mini-to-overlay
    >
      <q-scroll-area class="fit leftSide_main" >
        <q-list padding @click="hideDrawerClick">
          <q-item clickable v-ripple to="/dashboard/footer">
            <q-item-section avatar>
              <q-icon name="maps_home_work" />
            </q-item-section>

            <q-item-section class="leftSide_text">
              Dashboard
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/profile">
            <q-item-section avatar>
              <q-icon name="manage_accounts" />
            </q-item-section>

            <q-item-section class="leftSide_text">
              Profile
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-ripple to="/setting">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>

            <q-item-section class="leftSide_text">
              Setting
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="pageContainer">
      <router-view  />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  mobile: Boolean
})
const leftDrawerOpen = ref(!props.mobile)
const hideLeftSide = ref(true)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function hideDrawerClick () {
  if (props.mobile) {
    leftDrawerOpen.value = false
  } else { hideLeftSide.value = true }
}

</script>

<style lang="scss" scoped>
.mini-slot {
  &-slot {
    transition: background-color .28s;

    &:hover {
      background-color: rgba(0, 0, 0, .04);
    }
  }
  &-icon{
    font-size: 1.718em;
    margin-top: 18px;
  }
}

.leftSide{
  color: white;
  &_main{
    background-color: #293444;
  }
  &_text{
    color: #d0d0d0;
    font-size: 16px;
  }
}

.pageContainer{
  width: 100vw;
}
</style>
