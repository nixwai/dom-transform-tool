const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/base.DbSMcRK0.js","assets/chunks/framework.D-21DtBt.js","assets/chunks/index.DUTA42rz.js","assets/chunks/update-style.BgYSnce5.js","assets/chunks/dom-size.DLEdOKfj.js"])))=>i.map(i=>d[i]);
import{d as r,v as d,a0 as g,C as y,o,c as F,j as i,a as k,a1 as E,a2 as A,E as a,k as n,w as p,a3 as c,a4 as D,p as m,G as C}from"./chunks/framework.D-21DtBt.js";import{H as B,G as u}from"./chunks/placeholder.b33eaecc.CSEaLzja.js";const f=`<script setup lang="ts">\r
import type { DomResizeDirection } from 'dom-transform-tool';
import { domResize } from 'dom-transform-tool';\r
import { ref } from 'vue';\r
\r
const resizeTarget1 = ref<HTMLDivElement>();\r
\r
const directionList: DomResizeDirection[] = [\r
  'all',\r
  'left',\r
  'right',\r
  'top',\r
  'bottom',\r
  'left-top',\r
  'left-bottom',\r
  'right-top',\r
  'right-bottom',\r
  'left-right',\r
  'top-bottom',\r
  'left-top-right',\r
  'left-bottom-right',\r
  'top-left-bottom',\r
  'top-right-bottom',\r
];\r
\r
const direction = ref(directionList[0]);\r
const lockAspectRatio = ref(false);\r
const offset = ref<'position' | 'transform' | 'translate'>('position');\r
const grid = ref([0.5, 0.5]);\r
const crossAxis = ref(false);\r
\r
function handleTargetResize(event: PointerEvent) {\r
  domResize({\r
    target: resizeTarget1.value,\r
    pointer: event,\r
    offsetType: offset.value,\r
    lockAspectRatio: lockAspectRatio.value,\r
    direction: direction.value,\r
    grid: grid.value,\r
    crossAxis: crossAxis.value,\r
    manual: undefined,\r
  });\r
}\r
\r
function changeTargetResize(dis: { x: number, y: number }) {\r
  domResize({\r
    target: resizeTarget1.value,\r
    offsetType: offset.value,\r
    lockAspectRatio: lockAspectRatio.value,\r
    direction: direction.value,\r
    grid: grid.value,\r
    crossAxis: crossAxis.value,\r
    manual: {\r
      width: dis.x,\r
      height: dis.y,\r
    },\r
  });\r
}\r
<\/script>\r
\r
<template>\r
  使用指针拖动调整尺寸\r
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
        id="unlock"\r
        v-model="lockAspectRatio"\r
        type="radio"\r
        name="lockAspectRatio"\r
        :value="false"\r
        class="mb-[3px]"\r
      >\r
      <label for="unlock">unlock</label>\r
    </div>\r
    <div>\r
      <input\r
        id="lock"\r
        v-model="lockAspectRatio"\r
        type="radio"\r
        name="lockAspectRatio"\r
        :value="true"\r
        class="mb-[3px]"\r
      >\r
      <label for="lock">lock</label>\r
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
    <div>\r
      <input\r
        id="none"\r
        v-model="offset"\r
        type="radio"\r
        name="offset"\r
        :value="undefined"\r
        class="mb-[3px]"\r
      >\r
      <label for="none">none</label>\r
    </div>\r
  </div>\r
\r
  <div class="flex gap-1 mt-4">\r
    <div>\r
      <input\r
        id="uncross"\r
        v-model="crossAxis"\r
        type="radio"\r
        name="crossAxis"\r
        :value="false"\r
        class="mb-[3px]"\r
      >\r
      <label for="uncross">uncross</label>\r
    </div>\r
    <div>\r
      <input\r
        id="cross"\r
        v-model="crossAxis"\r
        type="radio"\r
        name="crossAxis"\r
        :value="true"\r
        class="mb-[3px]"\r
      >\r
      <label for="cross">cross</label>\r
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
`,z=JSON.parse('{"title":"domResize","description":"","frontmatter":{},"headers":[],"relativePath":"dom-resize.md","filePath":"zh/dom-resize.md"}'),b={name:"dom-resize.md"},T=r({...b,setup(v){const l=m(!0),t=C();return d(async()=>{t.value=(await g(async()=>{const{default:h}=await import("./chunks/base.DbSMcRK0.js");return{default:h}},__vite__mapDeps([0,1,2,3,4]))).default}),(h,s)=>{const e=y("ClientOnly");return o(),F("div",null,[s[1]||(s[1]=i("h1",{id:"domresize",tabindex:"-1"},[k("domResize "),i("a",{class:"header-anchor",href:"#domresize","aria-label":'Permalink to "domResize"'},"​")],-1)),s[2]||(s[2]=i("p",null,"调整元素的大小",-1)),s[3]||(s[3]=i("h2",{id:"基础用法",tabindex:"-1"},[k("基础用法 "),i("a",{class:"header-anchor",href:"#基础用法","aria-label":'Permalink to "基础用法"'},"​")],-1)),E(a(n(B),null,null,512),[[A,l.value]]),a(e,null,{default:p(()=>[a(n(u),{title:"",description:"",locale:"",select:"vue",order:"vue,react,svelte,solid,preact,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",playground:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22svelte%22%3A%7B%7D%2C%22solid%22%3A%7B%7D%2C%22preact%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",htmlWriteWay:"write",background:"undefined",htmlPlayground:"",vuePlayground:"",reactPlayground:"",sveltePlayground:"",solidPlayground:"",preactPlayground:"",visible:!0,onMount:s[0]||(s[0]=()=>{l.value=!1}),vueCode:n(f)},c({_:2},[t.value?{name:"vue",fn:p(()=>[a(n(t))]),key:"0"}:void 0]),1032,["vueCode"])]),_:1}),s[4]||(s[4]=D("",4))])}}});export{z as __pageData,T as default};
