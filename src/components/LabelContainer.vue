<template>
  <div class="label">
    <div :style="labelStyle">{{label}}</div>
    <slot/>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  labelStyle: {
    type: Object,
    default: () => ({
      color: 'white',
      paddingBottom: '0px'
    })
  }
})
</script>

<style lang="scss" scoped>
  .label{
    font-size: 14px;
  }
</style>
