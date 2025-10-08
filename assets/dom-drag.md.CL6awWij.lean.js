const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/base.BRzUoEOR.js","assets/chunks/framework.DraZOub8.js","assets/chunks/update-style.Di614ZlN.js","assets/chunks/dom-size.DsQGIV4V.js"])))=>i.map(i=>d[i]);
import{p as r,D as d,v as g,ae as y,C as o,c as E,o as F,j as i,af as D,G as a,ag as c,a as p,ah as A,k as n,w as k,ai as m}from"./chunks/framework.DraZOub8.js";import{L as f,N as C}from"./chunks/index.C_Ii9GWq.js";const u=`<script setup lang="ts">\r
import type { DomDragDirection } from 'dom-transform-tool';\r
import { domDrag } from 'dom-transform-tool';\r
import { ref } from 'vue';\r
\r
const resizeTarget1 = ref<HTMLDivElement>();\r
\r
const directionList: DomDragDirection[] = ['all', 'x', 'y'];\r
\r
const direction = ref(directionList[0]);\r
const offset = ref<'position' | 'transform' | 'translate'>('position');\r
const grid = ref([0.5, 0.5]);\r
\r
function handleTargetResize(event: PointerEvent) {\r
  domDrag({\r
    target: resizeTarget1.value,\r
    pointer: event,\r
    offsetType: offset.value,\r
    direction: direction.value,\r
    grid: grid.value,\r
    manual: undefined,\r
  });\r
}\r
\r
function changeTargetResize(dis: { x: number, y: number }) {\r
  domDrag({\r
    target: resizeTarget1.value,\r
    offsetType: offset.value,\r
    direction: direction.value,\r
    grid: grid.value,\r
    manual: {\r
      offsetX: dis.x,\r
      offsetY: dis.y,\r
    },\r
  });\r
}\r
<\/script>\r
\r
<template>\r
  使用指针拖动调整位置\r
\r
  <div class="flex flex-wrap gap-1 mt-4">\r
    <div v-for="(dir, index) in directionList" :key="dir">\r
      <input\r
        :id="\`dir\${index}\`"\r
        v-model="direction"\r
        type="radio"\r
        name="direction"\r
        :value="dir"\r
        class="mb-[3px]"\r
      >\r
      <label :for="\`dir\${index}\`">{{ dir }}</label>\r
    </div>\r
  </div>\r
\r
  <div class="flex gap-1 mt-4">\r
    <div>\r
      <input\r
        id="position"\r
        v-model="offset"\r
        type="radio"\r
        name="offset"\r
        value="position"\r
        class="mb-[3px]"\r
      >\r
      <label for="position">position</label>\r
    </div>\r
    <div>\r
      <input\r
        id="transform"\r
        v-model="offset"\r
        type="radio"\r
        name="offset"\r
        value="transform"\r
        class="mb-[3px]"\r
      >\r
      <label for="transform">transform</label>\r
    </div>\r
    <div>\r
      <input\r
        id="translate"\r
        v-model="offset"\r
        type="radio"\r
        name="offset"\r
        value="translate"\r
        class="mb-[3px]"\r
      >\r
      <label for="translate">translate</label>\r
    </div>\r
  </div>\r
\r
  <div class="flex gap-1 mt-4">\r
    gridX: <input v-model="grid[0]" class="b-1 b-gray b-solid px-1 b-rounded">\r
    gridY: <input v-model="grid[1]" class="b-1 b-gray b-solid b-rounded px-1">\r
  </div>\r
\r
  <div class="flex mt-4 items-center justify-center flex-col w-40">\r
    <button class="ctxs-btn" @click="changeTargetResize({ x: 0, y: -5 })">\r
      -5\r
    </button>\r
    <div class="flex gap-1 items-center justify-center">\r
      <button class="ctxs-btn" @click="changeTargetResize({ x: -5, y: 0 })">\r
        -5\r
      </button>\r
      调整\r
      <button class="ctxs-btn" @click="changeTargetResize({ x: 5, y: 0 })">\r
        +5\r
      </button>\r
    </div>\r
    <button class="ctxs-btn" @click="changeTargetResize({ x: 0, y: 5 })">\r
      +5\r
    </button>\r
  </div>\r
\r
  <div class="position-relative h-100">\r
    <div\r
      ref="resizeTarget1"\r
      class="w-30 h-30 position-absolute bg-blue min-w-10 min-h-10 max-w-100 left-[200px] max-h-100 top-[200px]"\r
      @pointerdown.stop.prevent="handleTargetResize"\r
    />\r
  </div>\r
</template>\r
\r
<style lang="css" scoped>\r
.ctxs-btn {\r
  width: 40px;\r
  padding: 0 10px;\r
  margin: 5px;\r
  border: 1px solid gray;\r
  border-radius: 4px;\r
}\r
</style>\r
`,_=JSON.parse('{"title":"domDrag","description":"","frontmatter":{},"headers":[],"relativePath":"dom-drag.md","filePath":"zh/dom-drag.md"}'),B={name:"dom-drag.md"},T=Object.assign(B,{setup(b){const l=r(!0),t=d();return g(async()=>{t.value=(await y(async()=>{const{default:h}=await import("./chunks/base.BRzUoEOR.js");return{default:h}},__vite__mapDeps([0,1,2,3]))).default}),(h,s)=>{const e=o("ClientOnly");return F(),E("div",null,[s[1]||(s[1]=i("h1",{id:"domdrag",tabindex:"-1"},[p("domDrag "),i("a",{class:"header-anchor",href:"#domdrag","aria-label":'Permalink to "domDrag"'},"​")],-1)),s[2]||(s[2]=i("p",null,"调整元素的位置",-1)),s[3]||(s[3]=i("h2",{id:"基础用法",tabindex:"-1"},[p("基础用法 "),i("a",{class:"header-anchor",href:"#基础用法","aria-label":'Permalink to "基础用法"'},"​")],-1)),D(a(n(f),null,null,512),[[A,l.value]]),a(e,null,{default:k(()=>[a(n(C),{title:"",description:"",locale:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",htmlWriteWay:"write",background:"undefined",visible:!0,onMount:s[0]||(s[0]=()=>{l.value=!1}),vueCode:n(u)},m({_:2},[t.value?{name:"vue",fn:k(()=>[a(n(t))]),key:"0"}:void 0]),1032,["vueCode"])]),_:1}),s[4]||(s[4]=c("",4))])}}});export{_ as __pageData,T as default};
