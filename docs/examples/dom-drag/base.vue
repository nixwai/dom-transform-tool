<script setup lang="ts">
import type { DomDragDirection } from 'dom-transform-tool';
import { domDrag } from 'dom-transform-tool';
import { ref } from 'vue';

const resizeTarget1 = ref<HTMLDivElement>();

const directionList: DomDragDirection[] = ['all', 'x', 'y'];

const direction = ref(directionList[0]);
const offset = ref<'position' | 'transform' | 'translate'>('position');
const grid = ref([0.5, 0.5]);

function handleTargetResize(event: PointerEvent) {
  domDrag({
    target: resizeTarget1.value,
    pointer: event,
    offsetType: offset.value,
    direction: direction.value,
    grid: grid.value,
    manual: undefined,
  });
}

function changeTargetResize(dis: { x: number, y: number }) {
  domDrag({
    target: resizeTarget1.value,
    offsetType: offset.value,
    direction: direction.value,
    grid: grid.value,
    manual: {
      offsetX: dis.x,
      offsetY: dis.y,
    },
  });
}
</script>

<template>
  使用指针拖动调整位置

  <div class="flex flex-wrap gap-1 mt-4">
    <div v-for="(dir, index) in directionList" :key="dir">
      <input
        :id="`dir${index}`"
        v-model="direction"
        type="radio"
        name="direction"
        :value="dir"
        class="mb-[3px]"
      >
      <label :for="`dir${index}`">{{ dir }}</label>
    </div>
  </div>

  <div class="flex gap-1 mt-4">
    <div>
      <input
        id="position"
        v-model="offset"
        type="radio"
        name="offset"
        value="position"
        class="mb-[3px]"
      >
      <label for="position">position</label>
    </div>
    <div>
      <input
        id="transform"
        v-model="offset"
        type="radio"
        name="offset"
        value="transform"
        class="mb-[3px]"
      >
      <label for="transform">transform</label>
    </div>
    <div>
      <input
        id="translate"
        v-model="offset"
        type="radio"
        name="offset"
        value="translate"
        class="mb-[3px]"
      >
      <label for="translate">translate</label>
    </div>
  </div>

  <div class="flex gap-1 mt-4">
    gridX: <input v-model="grid[0]" class="b-1 b-gray b-solid px-1 b-rounded">
    gridY: <input v-model="grid[1]" class="b-1 b-gray b-solid b-rounded px-1">
  </div>

  <div class="flex mt-4 items-center justify-center flex-col w-40">
    <button class="ctxs-btn" @click="changeTargetResize({ x: 0, y: -5 })">
      -5
    </button>
    <div class="flex gap-1 items-center justify-center">
      <button class="ctxs-btn" @click="changeTargetResize({ x: -5, y: 0 })">
        -5
      </button>
      调整
      <button class="ctxs-btn" @click="changeTargetResize({ x: 5, y: 0 })">
        +5
      </button>
    </div>
    <button class="ctxs-btn" @click="changeTargetResize({ x: 0, y: 5 })">
      +5
    </button>
  </div>

  <div class="position-relative h-100">
    <div
      ref="resizeTarget1"
      class="w-30 h-30 position-absolute bg-blue min-w-10 min-h-10 max-w-100 left-[200px] max-h-100 top-[200px]"
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
