<script setup lang="ts">
import { domResize } from 'dom-transform-tool';
import { ref } from 'vue';

const resizeTarget1 = ref<HTMLDivElement>();
const resizeTarget2 = ref<HTMLDivElement>();
const resizeTarget3 = ref<HTMLDivElement>();
const resizeTarget4 = ref<HTMLDivElement>();

function handleTarget1ResizeHeight(e: PointerEvent) {
  domResize({
    target: resizeTarget1.value,
    pointer: e,
    direction: 'bottom',
  });
}

function handleTarget2Resize(e: PointerEvent) {
  domResize({
    target: resizeTarget2.value,
    pointer: e,
    direction: 'right',
  });
  handleTarget1ResizeHeight(e);
}

function handleTarget3Resize(e: PointerEvent) {
  domResize({
    target: resizeTarget3.value,
    pointer: e,
    direction: 'right',
  });
  handleTarget1ResizeHeight(e);
}

function handleTarget4Resize(e: PointerEvent) {
  domResize({
    target: resizeTarget4.value,
    pointer: e,
    direction: 'right',
  });
  handleTarget1ResizeHeight(e);
}
</script>

<template>
  <div ref="resizeTarget1" class="flex max-w-100% min-w-120 min-h-20 max-h-60">
    <div
      ref="resizeTarget2"
      class="w-40 bg-green min-w-10% max-w-40%"
      @pointerdown.stop.prevent="handleTarget2Resize"
    />
    <div
      ref="resizeTarget3"
      class="w-40 min-w-10% max-w-40% bg-yellow"
      @pointerdown.stop.prevent="handleTarget3Resize"
    />
    <div
      ref="resizeTarget4"
      class="min-w-10% max-w-40% w-20 bg-red"
      @pointerdown.stop.prevent="handleTarget4Resize"
    />
  </div>
</template>
