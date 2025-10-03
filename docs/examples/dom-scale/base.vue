<script setup lang="ts">
import type { DomScaleDirection, DomScaleType } from 'dom-transform-tool';
import { domScale } from 'dom-transform-tool';
import { ref } from 'vue';

const scaleTarget1 = ref<HTMLDivElement>();
const direction = ref<DomScaleDirection>('all');
const scaleType = ref<DomScaleType>('scale');

function handleTargetScale(event: WheelEvent) {
  const { deltaY } = event;
  const scaleValue = deltaY > 0 ? 0.1 : -0.1;
  domScale({
    target: scaleTarget1.value,
    direction: direction.value,
    scaleType: scaleType.value,
    manual: { scale: scaleValue },
    customStyle: { maxScale: 3, minScale: 0.5 },
  });
}

function changeTargetScale(scale: { x: number, y: number }) {
  domScale({
    target: scaleTarget1.value,
    direction: direction.value,
    manual: { scale: [scale.x, scale.y] },
    scaleType: scaleType.value,
    customStyle: { maxScale: 3, minScale: 0.5 },
  });
}
</script>

<template>
  使用滚轮放大缩小

  <div class="flex gap-1 mt-4">
    <div>
      <input
        id="all"
        v-model="direction"
        type="radio"
        name="scale"
        value="all"
        class="mb-[3px]"
      >
      <label for="all">all</label>
    </div>
    <div>
      <input
        id="x"
        v-model="direction"
        type="radio"
        name="scale"
        value="x"
        class="mb-[3px]"
      >
      <label for="x">x</label>
    </div>
    <div>
      <input
        id="y"
        v-model="direction"
        type="radio"
        name="scale"
        value="y"
        class="mb-[3px]"
      >
      <label for="y">y</label>
    </div>
  </div>

  <div class="flex gap-1 mt-4">
    <div>
      <input
        id="scale"
        v-model="scaleType"
        type="radio"
        name="rotateType"
        value="scale"
        class="mb-[3px]"
      >
      <label for="scale">scale</label>
    </div>
    <div>
      <input
        id="transform"
        v-model="scaleType"
        type="radio"
        name="rotateType"
        value="transform"
        class="mb-[3px]"
      >
      <label for="transform">transform</label>
    </div>
  </div>

  <div class="flex mt-4 items-center justify-center flex-col w-40">
    <button class="ctxs-btn" @click="changeTargetScale({ x: 0, y: -0.1 })">
      -0.1
    </button>
    <div class="flex gap-1 items-center justify-center">
      <button class="ctxs-btn" @click="changeTargetScale({ x: -0.1, y: 0 })">
        -0.1
      </button>
      调整
      <button class="ctxs-btn" @click="changeTargetScale({ x: 0.1, y: 0 })">
        +0.1
      </button>
    </div>
    <button class="ctxs-btn" @click="changeTargetScale({ x: 0, y: 0.1 })">
      +0.1
    </button>
  </div>

  <div class="position-relative h-100">
    <div
      ref="scaleTarget1"
      class="w-30 h-30 position-absolute bg-blue min-w-10 min-h-10 max-w-100 left-[200px] max-h-100 top-[200px]"
      @wheel.stop.prevent="handleTargetScale"
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
