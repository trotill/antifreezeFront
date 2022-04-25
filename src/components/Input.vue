<template>
  <div class="input-main">
    <div class="input-main-labelWrap">
      <div class="input-main-label">{{label}}</div>
    </div>
    <div class="input-main-inputWrap" :class="{changed}">
      <input :value="(!isFocus||readonly)?modelValue:editValue" @input="(event)=>updateValue(event.target.value)" @focusout="isFocus=false,editValue=''" @focusin="isFocus=true" class="input-main-input"  :readonly="readonly"/>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  readonly: {
    type: Boolean,
    default: false
  },
  label: String,
  modelValue: {
    type: [String, Number],
    default: '',
    required: true
  },
  changed: Boolean
})

console.log('input', props.modelValue)
const calcFontSize = (v) => Math.trunc(18 - (v.toString().length / 8)) + 'px'

const fontSize = ref(calcFontSize(props.modelValue))
const isFocus = ref(false)
const emit = defineEmits(['update:modelValue', 'update:changed'])
const editValue = ref('')
const roMarkerColor = ref('#590606')
if (!props.readonly) { roMarkerColor.value = 'white' }

function updateValue (v) {
  if (isFocus.value) {
    editValue.value = v
    emit('update:changed', true)
  }
  fontSize.value = calcFontSize(v)
  emit('update:modelValue', v)
}

watch(() => props.modelValue, (newValue, oldValue) => {
  if (!isFocus.value) {
    updateValue(props.modelValue)
  }
})

</script>

<style lang="scss" scoped>
.input-main{
  display: flex;
  border-style: solid;
  border-width: 1px;
  border-color: #a8a8a8;
  border-radius: 5px;
}
.input-main-labelWrap{
  background-color: #2b2b2b;
  display: flex;
  padding: 5px;
  min-width: 130px;
  justify-content: flex-end;
  border-radius: 5px 0px 0px 5px;
  border-right-style: solid;
  border-width: 1px;
  border-color: v-bind(roMarkerColor);
}
.input-main-label{
  font-size: 18px;
  color: #bebebe;
}

.input-main-input{
  font-size: v-bind(fontSize);
  width: 200px;
  height: 20px;
  color: #bebebe;
  background-color: transparent;
  border-style: none;
  &:focus{
    outline: none;
  }
}
.input-main-inputWrap{
  display: flex;
  align-items: center;
  background-color: #454545;
  border-radius: 0px 5px 5px 0px;
  padding-left: 3px;
}
.changed{
  background-color: #3f2121;
}
</style>
