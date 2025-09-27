<script setup lang="ts">
import { ref } from 'vue';
import { domRotate } from '../../../packages/utils/src/index';

const rotateTarget1 = ref<HTMLDivElement>();

function handleTargetResize(event: PointerEvent) {
  domRotate({
    target: rotateTarget1.value,
    pointer: event,
  });
}

function changeTargetRotate(deg: number) {
  domRotate({
    target: rotateTarget1.value,
    manual: { rotate: deg },
  });
}
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <div class="flex gap-1 items-center justify-center">
      <button class="ctxs-btn" @click="changeTargetRotate(-5)">
        -5
      </button>
      调整
      <button class="ctxs-btn" @click="changeTargetRotate(5)">
        +5
      </button>
    </div>
  </div>

  <div class="position-relative h-100">
    <div
      ref="rotateTarget1"
      class="w-60 h-30 position-absolute bg-blue min-w-10 min-h-10 max-w-100 left-[200px] max-h-100 top-[200px]"
      style="transform-origin: left top;"
      @pointerdown.stop.prevent="handleTargetResize"
    />
  </div>
</template>

<style lang="css" scoped>
.ctxs-btn {
  width: 40px;
  padding: 0 10px;
  margin: 5px;
  border: 1px solid gray;
  border-radius: 4px;
}
</style>
