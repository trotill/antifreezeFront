<template>
  <div>
  <div class="groupContainer-label">{{label}}</div>
  <div class="groupContainer" >
    <div class="groupContainer-child" :class="{'groupContainer-child-empty':empty}">
    <slot/>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { groupContainerStep } from '../api/const.js'
const props = defineProps({
  label: String,
  xSize: {
    type: Number,
    default: 1
  },
  ySize: {
    type: Number,
    default: 1
  },
  boardColor: {
    type: String,
    default: 'transparent'
  },
  empty: Boolean
})

const width = ref(
  (props.xSize * groupContainerStep) + 'px'
)
const height = ref(
  (props.ySize * groupContainerStep) + 'px'
)
</script>

<style lang="scss" scoped>

.groupContainer{
  width: v-bind(width);
  height: v-bind(height);
  padding: 5px;
  &-child-empty{
    background-color: #0f1722;
    border-color: #545454!important;
  }
  &-child{
    display: flex;
    flex-wrap: nowrap;
    margin: 5px 0 0 0;
    justify-content: space-evenly;
    border-style: solid;
    border-width: 1px;
    border-color: $group-border-color;
    border-radius: 5px;
    align-items: center;
    height: 100%;
    align-content: center;
    flex-direction: row;
    background-color: v-bind(boardColor);
  }
}
.groupContainer-label{

  color: $group-border-color;
  background-color: $dashboard-color;
  width: max-content;
  margin-bottom: -5;
  position: absolute;
  padding: 0 5px 0 5px;
  font-size: 14px;
  margin-left: 15px;

}
</style>
