<template>
  <div class="input-main">
    <div class="input-main-labelWrap">
      <div class="input-main-label">{{label}}</div>
    </div>
    <div class="input-main-inputWrap" :class="{changed}">
      <input :value="(!changed)?modelValue:editValue" @input="(event)=>updateValue(event.target.value)" class="input-main-input"  :readonly="readonly"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

const calcFontSize = (v) => Math.trunc(18 - (v.toString().length / 8)) + 'px'

const fontSize = ref(calcFontSize(props.modelValue))
const emit = defineEmits(['update:modelValue', 'update:changed'])
const editValue = ref('')
const roMarkerColor = ref('#590606')
if (!props.readonly) { roMarkerColor.value = 'white' }

function updateValue (v) {
  editValue.value = v
  emit('update:changed', true)

  fontSize.value = calcFontSize(v)
  emit('update:modelValue', v)
}

</script>

<style lang="scss" scoped>
.input-main{
  display: flex;
  border-style: solid;
  border-width: 1px;
  border-color: #a8a8a8;
  border-radius: 5px;
  &-labelWrap{
    background-color: #2b2b2b;
    display: flex;
    padding: 5px;
    min-width: 130px;
    justify-content: flex-end;
    border-radius: 5px 0 0 5px;
    border-right-style: solid;
    border-width: 1px;
    border-color: v-bind(roMarkerColor);
  }
  &-label{
    font-size: 18px;
    color: #bebebe;
  }
  &-input{
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
  &-inputWrap{
    display: flex;
    align-items: center;
    background-color: #454545;
    border-radius: 0 5px 5px 0;
    padding-left: 3px;
    width: 100%;
  }
}

.changed{
  background-color: #3f2121;
}
</style>
