<script setup lang="ts">
import { ref } from 'vue';
import { domResize, type DomResizeDirection } from '../../../packages/utils/src/index';

const resizeTarget1 = ref<HTMLDivElement>();

const directionList: DomResizeDirection[] = [
  'all',
  'left',
  'right',
  'top',
  'bottom',
  'left-top',
  'left-bottom',
  'right-top',
  'right-bottom',
  'left-right',
  'top-bottom',
  'left-top-right',
  'left-bottom-right',
  'top-left-bottom',
  'top-right-bottom',
];

const direction = ref(directionList[0]);
const lockAspectRatio = ref(false);
const offset = ref<'position' | 'transform' | 'translate'>('position');
const grid = ref([0.5, 0.5]);
const crossAxis = ref(false);

function handleTargetResize(event: PointerEvent) {
  domResize({
    target: resizeTarget1.value,
    pointer: event,
    offsetType: offset.value,
    lockAspectRatio: lockAspectRatio.value,
    direction: direction.value,
    grid: grid.value,
    crossAxis: crossAxis.value,
    manual: undefined,
  });
}

function changeTargetResize(dis: { x: number, y: number }) {
  domResize({
    target: resizeTarget1.value,
    offsetType: offset.value,
    lockAspectRatio: lockAspectRatio.value,
    direction: direction.value,
    grid: grid.value,
    crossAxis: crossAxis.value,
    manual: {
      width: dis.x,
      height: dis.y,
    },
  });
}
</script>

<template>
  <div class="flex flex-wrap gap-1">
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
        id="unlock"
        v-model="lockAspectRatio"
        type="radio"
        name="lockAspectRatio"
        :value="false"
        class="mb-[3px]"
      >
      <label for="unlock">unlock</label>
    </div>
    <div>
      <input
        id="lock"
        v-model="lockAspectRatio"
        type="radio"
        name="lockAspectRatio"
        :value="true"
        class="mb-[3px]"
      >
      <label for="lock">lock</label>
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
    <div>
      <input
        id="none"
        v-model="offset"
        type="radio"
        name="offset"
        :value="undefined"
        class="mb-[3px]"
      >
      <label for="none">none</label>
    </div>
  </div>

  <div class="flex gap-1 mt-4">
    <div>
      <input
        id="uncross"
        v-model="crossAxis"
        type="radio"
        name="crossAxis"
        :value="false"
        class="mb-[3px]"
      >
      <label for="uncross">uncross</label>
    </div>
    <div>
      <input
        id="cross"
        v-model="crossAxis"
        type="radio"
        name="crossAxis"
        :value="true"
        class="mb-[3px]"
      >
      <label for="cross">cross</label>
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
