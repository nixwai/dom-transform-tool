<script setup lang="ts">
import type { DomResizeDirection } from 'dom-transform-tool';
import { domDrag, domResize, domRotate, domScale } from 'dom-transform-tool';
import { ref } from 'vue';

const target = ref<HTMLDivElement>();

const resizeHandles: Array<{ direction: DomResizeDirection, className: string }> = [
  { direction: 'left-top', className: 'handle-left-top' },
  { direction: 'top', className: 'handle-top' },
  { direction: 'right-top', className: 'handle-right-top' },
  { direction: 'right', className: 'handle-right' },
  { direction: 'right-bottom', className: 'handle-right-bottom' },
  { direction: 'bottom', className: 'handle-bottom' },
  { direction: 'left-bottom', className: 'handle-left-bottom' },
  { direction: 'left', className: 'handle-left' },
];

function handleDrag(event: PointerEvent) {
  domDrag({
    target: target.value,
    pointer: event,
  });
}

function handleResize(event: PointerEvent, direction: DomResizeDirection) {
  domResize({
    target: target.value,
    pointer: event,
    offsetType: 'position',
    direction,
    grid: [0.5, 0.5],
    crossAxis: true,
  });
}

function handleRotate(event: PointerEvent) {
  domRotate({
    target: target.value,
    pointer: event,
    step: 0.5,
  });
}

function handleScale(event: WheelEvent) {
  const scale = event.deltaY > 0 ? -0.1 : 0.1;
  domScale({
    target: target.value,
    manual: { scale },
    customStyle: { minScale: 0.5, maxScale: 3 },
  });
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div>拖动主体移动，拖动八个控制点调整尺寸，拖动顶部旋转，滚动鼠标缩放</div>

    <div class="position-relative h-100 min-h-100">
      <div
        ref="target"
        class="w-40 h-30 position-absolute bg-blue left-[200px] top-[200px]"
        @pointerdown.stop.prevent="handleDrag"
        @wheel.stop.prevent="handleScale"
      >
        <div
          v-for="handle in resizeHandles"
          :key="handle.direction"
          class="handle handle-resize"
          :class="handle.className"
          @pointerdown.stop.prevent="handleResize($event, handle.direction)"
        />
        <div
          class="handle handle-rotate"
          @pointerdown.stop.prevent="handleRotate"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.handle {
  position: absolute;
  z-index: 1;
  width: 12px;
  height: 12px;
  background-color: #646cff;
  border: 2px solid white;
  border-radius: 50%;
}

.handle-rotate {
  top: -24px;
  left: 50%;
  cursor: grab;
  background-color: #ff6e64;
  transform: translateX(-50%);
}

.handle-resize {
  transform: translate(-50%, -50%);
}

.handle-left-top {
  top: 0;
  left: 0;
  cursor: nwse-resize;
}

.handle-top {
  top: 0;
  left: 50%;
  cursor: ns-resize;
}

.handle-right-top {
  top: 0;
  left: 100%;
  cursor: nesw-resize;
}

.handle-right {
  top: 50%;
  left: 100%;
  cursor: ew-resize;
}

.handle-right-bottom {
  top: 100%;
  left: 100%;
  cursor: nwse-resize;
}

.handle-bottom {
  top: 100%;
  left: 50%;
  cursor: ns-resize;
}

.handle-left-bottom {
  top: 100%;
  left: 0;
  cursor: nesw-resize;
}

.handle-left {
  top: 50%;
  left: 0;
  cursor: ew-resize;
}
</style>
