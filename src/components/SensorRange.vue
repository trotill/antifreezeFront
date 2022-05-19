<template>
  <div class="rangeMain">
    <q-badge color="black" class="q-mb-md">
      {{ label }}
    </q-badge>
    <q-range
      :model-value="modelValue"
      @update:modelValue="update"
      :min="min"
      :max="max"
      track-color="orange"
      selection-color="yellow"
      color="primary"
      vertical
      snap
      :step="step"
      reverse
      label-always
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: Object,
  label: {
    type: String,
    default: ''
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 1000
  },
  step: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['update:modelValue'])

function update (v) {
  emit('update:modelValue', v)
}
</script>

<style scoped>
.rangeMain{
  display: flex;
  flex-direction: column;
  height: 200px;
}
</style>
