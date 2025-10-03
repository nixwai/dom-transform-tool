const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/direction.Bb4lp2h4.js","assets/chunks/framework.DraZOub8.js","assets/chunks/index.B1g2gllY.js","assets/chunks/update-style.Di614ZlN.js","assets/chunks/base.DDamCjKn.js"])))=>i.map(i=>d[i]);
import{D as d,v as g,ae as o,p as D,C as m,c as C,o as u,j as n,af as y,G as i,ag as f,a as p,ah as F,k as a,w as e,ai as E}from"./chunks/framework.DraZOub8.js";import{L as c,N as A}from"./chunks/index.C_Ii9GWq.js";const B=`<script setup lang="ts">\r
import { domResize } from 'dom-transform-tool';\r
import { ref } from 'vue';\r
\r
const resizeTarget1 = ref<HTMLDivElement>();\r
const resizeTarget2 = ref<HTMLDivElement>();\r
const resizeTarget3 = ref<HTMLDivElement>();\r
const resizeTarget4 = ref<HTMLDivElement>();\r
\r
function handleTarget1ResizeHeight(e: PointerEvent) {\r
  domResize({\r
    target: resizeTarget1.value,\r
    pointer: e,\r
    direction: 'bottom',\r
  });\r
}\r
\r
function handleTarget2Resize(e: PointerEvent) {\r
  domResize({\r
    target: resizeTarget2.value,\r
    pointer: e,\r
    direction: 'right',\r
  });\r
  handleTarget1ResizeHeight(e);\r
}\r
\r
function handleTarget3Resize(e: PointerEvent) {\r
  domResize({\r
    target: resizeTarget3.value,\r
    pointer: e,\r
    direction: 'right',\r
  });\r
  handleTarget1ResizeHeight(e);\r
}\r
\r
function handleTarget4Resize(e: PointerEvent) {\r
  domResize({\r
    target: resizeTarget4.value,\r
    pointer: e,\r
    direction: 'right',\r
  });\r
  handleTarget1ResizeHeight(e);\r
}\r
<\/script>\r
\r
<template>\r
  <div ref="resizeTarget1" class="flex max-w-100% min-w-120 min-h-20 max-h-60">\r
    <div\r
      ref="resizeTarget2"\r
      class="w-40 bg-green min-w-10% max-w-40%"\r
      @pointerdown.stop.prevent="handleTarget2Resize"\r
    />\r
    <div\r
      ref="resizeTarget3"\r
      class="w-40 min-w-10% max-w-40% bg-yellow"\r
      @pointerdown.stop.prevent="handleTarget3Resize"\r
    />\r
    <div\r
      ref="resizeTarget4"\r
      class="min-w-10% max-w-40% w-20 bg-red"\r
      @pointerdown.stop.prevent="handleTarget4Resize"\r
    />\r
  </div>\r
</template>\r
`,b=`<script setup lang="ts">\r
import { domResize, type DomResizeDirection } from 'dom-transform-tool';\r
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
  使用指针拖拖动调整尺寸\r
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
`,T=JSON.parse('{"title":"domResize","description":"","frontmatter":{},"headers":[],"relativePath":"dom-resize.md","filePath":"zh/dom-resize.md"}'),v={name:"dom-resize.md"},w=Object.assign(v,{setup(x){const h=d();g(async()=>{h.value=(await o(async()=>{const{default:l}=await import("./chunks/direction.Bb4lp2h4.js");return{default:l}},__vite__mapDeps([0,1,2,3]))).default});const t=D(!0),k=d();return g(async()=>{k.value=(await o(async()=>{const{default:l}=await import("./chunks/base.DDamCjKn.js");return{default:l}},__vite__mapDeps([4,1,2,3]))).default}),(l,s)=>{const r=m("ClientOnly");return u(),C("div",null,[s[2]||(s[2]=n("h1",{id:"domresize",tabindex:"-1"},[p("domResize "),n("a",{class:"header-anchor",href:"#domresize","aria-label":'Permalink to "domResize"'},"​")],-1)),s[3]||(s[3]=n("p",null,"调整元素的大小",-1)),s[4]||(s[4]=n("h2",{id:"基础用法",tabindex:"-1"},[p("基础用法 "),n("a",{class:"header-anchor",href:"#基础用法","aria-label":'Permalink to "基础用法"'},"​")],-1)),y(i(a(c),null,null,512),[[F,t.value]]),i(r,null,{default:e(()=>[i(a(A),{title:"",description:"",locale:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",htmlWriteWay:"write",background:"undefined",visible:!0,onMount:s[0]||(s[0]=()=>{t.value=!1}),vueCode:a(b)},E({_:2},[k.value?{name:"vue",fn:e(()=>[i(a(k))]),key:"0"}:void 0]),1032,["vueCode"])]),_:1}),s[5]||(s[5]=n("h2",{id:"支持多种方向",tabindex:"-1"},[p("支持多种方向 "),n("a",{class:"header-anchor",href:"#支持多种方向","aria-label":'Permalink to "支持多种方向"'},"​")],-1)),y(i(a(c),null,null,512),[[F,t.value]]),i(r,null,{default:e(()=>[i(a(A),{title:"",description:"",locale:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",htmlWriteWay:"write",background:"undefined",visible:!0,onMount:s[1]||(s[1]=()=>{t.value=!1}),vueCode:a(B)},E({_:2},[h.value?{name:"vue",fn:e(()=>[i(a(h))]),key:"0"}:void 0]),1032,["vueCode"])]),_:1}),s[6]||(s[6]=f("",4))])}}});export{T as __pageData,w as default};
