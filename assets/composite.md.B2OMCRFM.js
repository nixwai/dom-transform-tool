const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/base.BSnbxZJw.js","assets/chunks/framework.D-21DtBt.js","assets/chunks/index.Bmc0Lz0c.js","assets/chunks/update-style.BgYSnce5.js","assets/chunks/dom-size.DLEdOKfj.js","assets/chunks/index.DUTA42rz.js","assets/chunks/index.DUgRwdxX.js","assets/chunks/index.C25a3W1Z.js"])))=>i.map(i=>d[i]);
import{d,v as c,a0 as m,C as p,o as h,c as u,j as r,a as f,a1 as v,a2 as g,E as n,k as t,w as s,a3 as b,p as y,G as _}from"./chunks/framework.D-21DtBt.js";import{H as w,G as z}from"./chunks/placeholder.b33eaecc.CSEaLzja.js";const D=`<script setup lang="ts">
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
<\/script>

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
`,X=JSON.parse('{"title":"综合应用","description":"","frontmatter":{},"headers":[],"relativePath":"composite.md","filePath":"zh/composite.md"}'),R={name:"composite.md"},k=d({...R,setup(x){const o=y(!0),a=_();return c(async()=>{a.value=(await m(async()=>{const{default:l}=await import("./chunks/base.BSnbxZJw.js");return{default:l}},__vite__mapDeps([0,1,2,3,4,5,6,7]))).default}),(l,e)=>{const i=p("ClientOnly");return h(),u("div",null,[e[1]||(e[1]=r("h1",{id:"综合应用",tabindex:"-1"},[f("综合应用 "),r("a",{class:"header-anchor",href:"#综合应用","aria-label":'Permalink to "综合应用"'},"​")],-1)),v(n(t(w),null,null,512),[[g,o.value]]),n(i,null,{default:s(()=>[n(t(z),{title:"",description:"",locale:"",select:"vue",order:"vue,react,svelte,solid,preact,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",playground:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22svelte%22%3A%7B%7D%2C%22solid%22%3A%7B%7D%2C%22preact%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",htmlWriteWay:"write",background:"undefined",htmlPlayground:"",vuePlayground:"",reactPlayground:"",sveltePlayground:"",solidPlayground:"",preactPlayground:"",visible:!0,onMount:e[0]||(e[0]=()=>{o.value=!1}),vueCode:t(D)},b({_:2},[a.value?{name:"vue",fn:s(()=>[n(t(a))]),key:"0"}:void 0]),1032,["vueCode"])]),_:1})])}}});export{X as __pageData,k as default};
