<script setup lang="ts">
import type { DomRotateType } from 'dom-transform-tool/src/domRotate/types';
import { ref } from 'vue';
import { domRotate } from '../../../packages/utils/src/index';

const rotateTarget1 = ref<HTMLDivElement>();

const rotateType = ref<DomRotateType>('rotate');
const step = ref<string>();

function handleTargetRotate(event: PointerEvent) {
  domRotate({
    target: rotateTarget1.value,
    pointer: event,
    step: Number(step.value) || undefined,
    rotateType: rotateType.value,
  });
}

function changeTargetRotate(deg: number) {
  domRotate({
    target: rotateTarget1.value,
    manual: { rotate: deg },
    step: Number(step.value) || undefined,
    rotateType: rotateType.value,
  });
}
</script>

<template>
  <div class="flex gap-1 mt-4">
    <div>
      <input
        id="rotate"
        v-model="rotateType"
        type="radio"
        name="rotateType"
        value="rotate"
        class="mb-[3px]"
      >
      <label for="rotate">rotate</label>
    </div>
    <div>
      <input
        id="transform"
        v-model="rotateType"
        type="radio"
        name="rotateType"
        value="transform"
        class="mb-[3px]"
      >
      <label for="transform">transform</label>
    </div>
  </div>

  <div class="flex gap-1 mt-4">
    step: <input v-model="step" class="b-1 b-gray b-solid px-1 b-rounded">
  </div>

  <div class="flex flex-wrap gap-1 mt-4">
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
      @pointerdown.stop.prevent="handleTargetRotate"
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
