<template>
  <div>
  <div class="groupContainer-label">{{label}}</div>
  <div class="groupContainer">
    <div class="groupContainer-child">
    <slot/>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  label: String,
  xSize: {
    type: Number,
    default: 1
  },
  ySize: {
    type: Number,
    default: 1
  }
})

console.log('props.unit', props.xSize)
const width = ref(
  (props.xSize * 92) + 'px'
)
const height = ref(
  (props.ySize * 92) + 'px'
)
</script>

<style lang="scss" scoped>

.groupContainer{
  width: v-bind(width);
  height:v-bind(height);
  padding: 5px;
  &-child{
    display: flex;
    flex-wrap: nowrap;
    margin: 5px 0px 0px 0px;
    justify-content: space-evenly;
    border-style: solid;
    border-width: 1px;
    border-color: $group-border-color;
    border-radius: 5px;
    align-items: center;
    height: 100%;
    align-content: center;
    flex-direction: row;
  }
}
.groupContainer-label{

  color: $group-border-color;
  background-color: $dashboard-color;
  width: max-content;
  margin-bottom: -5;
  /* bottom: -17px; */
  position: absolute;
  /* z-index: 222; */
  /* left: 10px; */
  padding: 0 5px 0 5px;
  font-size: 14px;
  margin-left: 15px;

}
</style>
