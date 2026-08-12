const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/base.DegC2u3g.js","assets/chunks/framework.D-21DtBt.js","assets/chunks/index.C25a3W1Z.js","assets/chunks/update-style.BgYSnce5.js"])))=>i.map(i=>d[i]);
import{d as r,v as d,a0 as c,C as o,o as y,c as g,j as i,a as h,a1 as E,a2 as F,E as a,k as n,w as p,a3 as m,a4 as D,p as A,G as u}from"./chunks/framework.D-21DtBt.js";import{H as b,G as v}from"./chunks/placeholder.b33eaecc.CSEaLzja.js";const C=`<script setup lang="ts">\r
import type { DomScaleDirection, DomScaleType } from 'dom-transform-tool';\r
import { domScale } from 'dom-transform-tool';\r
import { ref } from 'vue';\r
\r
const scaleTarget1 = ref<HTMLDivElement>();\r
const direction = ref<DomScaleDirection>('all');\r
const scaleType = ref<DomScaleType>('scale');\r
\r
function handleTargetScale(event: WheelEvent) {\r
  const { deltaY } = event;\r
  const scaleValue = deltaY > 0 ? 0.1 : -0.1;\r
  domScale({\r
    target: scaleTarget1.value,\r
    direction: direction.value,\r
    scaleType: scaleType.value,\r
    manual: { scale: scaleValue },\r
    customStyle: { maxScale: 3, minScale: 0.5 },\r
  });\r
}\r
\r
function changeTargetScale(scale: { x: number, y: number }) {\r
  domScale({\r
    target: scaleTarget1.value,\r
    direction: direction.value,\r
    manual: { scale: [scale.x, scale.y] },\r
    scaleType: scaleType.value,\r
    customStyle: { maxScale: 3, minScale: 0.5 },\r
  });\r
}\r
<\/script>\r
\r
<template>\r
  使用滚轮放大缩小\r
\r
  <div class="flex gap-1 mt-4">\r
    <div>\r
      <input\r
        id="all"\r
        v-model="direction"\r
        type="radio"\r
        name="scale"\r
        value="all"\r
        class="mb-[3px]"\r
      >\r
      <label for="all">all</label>\r
    </div>\r
    <div>\r
      <input\r
        id="x"\r
        v-model="direction"\r
        type="radio"\r
        name="scale"\r
        value="x"\r
        class="mb-[3px]"\r
      >\r
      <label for="x">x</label>\r
    </div>\r
    <div>\r
      <input\r
        id="y"\r
        v-model="direction"\r
        type="radio"\r
        name="scale"\r
        value="y"\r
        class="mb-[3px]"\r
      >\r
      <label for="y">y</label>\r
    </div>\r
  </div>\r
\r
  <div class="flex gap-1 mt-4">\r
    <div>\r
      <input\r
        id="scale"\r
        v-model="scaleType"\r
        type="radio"\r
        name="rotateType"\r
        value="scale"\r
        class="mb-[3px]"\r
      >\r
      <label for="scale">scale</label>\r
    </div>\r
    <div>\r
      <input\r
        id="transform"\r
        v-model="scaleType"\r
        type="radio"\r
        name="rotateType"\r
        value="transform"\r
        class="mb-[3px]"\r
      >\r
      <label for="transform">transform</label>\r
    </div>\r
  </div>\r
\r
  <div class="flex mt-4 items-center justify-center flex-col w-40">\r
    <button class="ctxs-btn" @click="changeTargetScale({ x: 0, y: -0.1 })">\r
      -0.1\r
    </button>\r
    <div class="flex gap-1 items-center justify-center">\r
      <button class="ctxs-btn" @click="changeTargetScale({ x: -0.1, y: 0 })">\r
        -0.1\r
      </button>\r
      调整\r
      <button class="ctxs-btn" @click="changeTargetScale({ x: 0.1, y: 0 })">\r
        +0.1\r
      </button>\r
    </div>\r
    <button class="ctxs-btn" @click="changeTargetScale({ x: 0, y: 0.1 })">\r
      +0.1\r
    </button>\r
  </div>\r
\r
  <div class="position-relative h-100">\r
    <div\r
      ref="scaleTarget1"\r
      class="w-30 h-30 position-absolute bg-blue min-w-10 min-h-10 max-w-100 left-[200px] max-h-100 top-[200px]"\r
      @wheel.stop.prevent="handleTargetScale"\r
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
`,T=JSON.parse('{"title":"domScale","description":"","frontmatter":{},"headers":[],"relativePath":"dom-scale.md","filePath":"zh/dom-scale.md"}'),S={name:"dom-scale.md"},_=r({...S,setup(B){const e=A(!0),l=u();return d(async()=>{l.value=(await c(async()=>{const{default:t}=await import("./chunks/base.DegC2u3g.js");return{default:t}},__vite__mapDeps([0,1,2,3]))).default}),(t,s)=>{const k=o("ClientOnly");return y(),g("div",null,[s[1]||(s[1]=i("h1",{id:"domscale",tabindex:"-1"},[h("domScale "),i("a",{class:"header-anchor",href:"#domscale","aria-label":'Permalink to "domScale"'},"​")],-1)),s[2]||(s[2]=i("p",null,"调整元素的缩放比例",-1)),s[3]||(s[3]=i("h2",{id:"基础用法",tabindex:"-1"},[h("基础用法 "),i("a",{class:"header-anchor",href:"#基础用法","aria-label":'Permalink to "基础用法"'},"​")],-1)),E(a(n(b),null,null,512),[[F,e.value]]),a(k,null,{default:p(()=>[a(n(v),{title:"",description:"",locale:"",select:"vue",order:"vue,react,svelte,solid,preact,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",playground:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22svelte%22%3A%7B%7D%2C%22solid%22%3A%7B%7D%2C%22preact%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",htmlWriteWay:"write",background:"undefined",htmlPlayground:"",vuePlayground:"",reactPlayground:"",sveltePlayground:"",solidPlayground:"",preactPlayground:"",visible:!0,onMount:s[0]||(s[0]=()=>{e.value=!1}),vueCode:n(C)},m({_:2},[l.value?{name:"vue",fn:p(()=>[a(n(l))]),key:"0"}:void 0]),1032,["vueCode"])]),_:1}),s[4]||(s[4]=D("",4))])}}});export{T as __pageData,_ as default};
