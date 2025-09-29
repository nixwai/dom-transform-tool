const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/base.DOMsxS_i.js","assets/chunks/framework.DraZOub8.js","assets/chunks/update-style.Csv_yF-P.js"])))=>i.map(i=>d[i]);
import{p as r,D as d,v as o,ae as g,C as y,c as E,o as F,j as i,af as c,G as a,ag as A,a as h,ah as D,k as n,w as p,ai as m}from"./chunks/framework.DraZOub8.js";import{L as u,N as C}from"./chunks/index.C_Ii9GWq.js";const B=`<script setup lang="ts">\r
import type { DomRotateType } from 'dom-transform-tool';\r
import { domRotate } from 'dom-transform-tool';\r
import { ref } from 'vue';\r
\r
const rotateTarget1 = ref<HTMLDivElement>();\r
\r
const rotateType = ref<DomRotateType>('rotate');\r
const step = ref<string>();\r
\r
function handleTargetRotate(event: PointerEvent) {\r
  domRotate({\r
    target: rotateTarget1.value,\r
    pointer: event,\r
    step: Number(step.value) || undefined,\r
    rotateType: rotateType.value,\r
  });\r
}\r
\r
function changeTargetRotate(deg: number) {\r
  domRotate({\r
    target: rotateTarget1.value,\r
    manual: { rotate: deg },\r
    step: Number(step.value) || undefined,\r
    rotateType: rotateType.value,\r
  });\r
}\r
<\/script>\r
\r
<template>\r
  <div class="flex gap-1 mt-4">\r
    <div>\r
      <input\r
        id="rotate"\r
        v-model="rotateType"\r
        type="radio"\r
        name="rotateType"\r
        value="rotate"\r
        class="mb-[3px]"\r
      >\r
      <label for="rotate">rotate</label>\r
    </div>\r
    <div>\r
      <input\r
        id="transform"\r
        v-model="rotateType"\r
        type="radio"\r
        name="rotateType"\r
        value="transform"\r
        class="mb-[3px]"\r
      >\r
      <label for="transform">transform</label>\r
    </div>\r
  </div>\r
\r
  <div class="flex gap-1 mt-4">\r
    step: <input v-model="step" class="b-1 b-gray b-solid px-1 b-rounded">\r
  </div>\r
\r
  <div class="flex flex-wrap gap-1 mt-4">\r
    <div class="flex gap-1 items-center justify-center">\r
      <button class="ctxs-btn" @click="changeTargetRotate(-5)">\r
        -5\r
      </button>\r
      调整\r
      <button class="ctxs-btn" @click="changeTargetRotate(5)">\r
        +5\r
      </button>\r
    </div>\r
  </div>\r
\r
  <div class="position-relative h-100">\r
    <div\r
      ref="rotateTarget1"\r
      class="w-60 h-30 position-absolute bg-blue min-w-10 min-h-10 max-w-100 left-[200px] max-h-100 top-[200px]"\r
      @pointerdown.stop.prevent="handleTargetRotate"\r
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
`,T=JSON.parse('{"title":"domRotate","description":"","frontmatter":{},"headers":[],"relativePath":"dom-rotate.md","filePath":"zh/dom-rotate.md"}'),v={name:"dom-rotate.md"},x=Object.assign(v,{setup(b){const l=r(!0),t=d();return o(async()=>{t.value=(await g(async()=>{const{default:e}=await import("./chunks/base.DOMsxS_i.js");return{default:e}},__vite__mapDeps([0,1,2]))).default}),(e,s)=>{const k=y("ClientOnly");return F(),E("div",null,[s[1]||(s[1]=i("h1",{id:"domrotate",tabindex:"-1"},[h("domRotate "),i("a",{class:"header-anchor",href:"#domrotate","aria-label":'Permalink to "domRotate"'},"​")],-1)),s[2]||(s[2]=i("p",null,"调整元素的旋转角度",-1)),s[3]||(s[3]=i("h2",{id:"基础用法",tabindex:"-1"},[h("基础用法 "),i("a",{class:"header-anchor",href:"#基础用法","aria-label":'Permalink to "基础用法"'},"​")],-1)),c(a(n(u),null,null,512),[[D,l.value]]),a(k,null,{default:p(()=>[a(n(C),{title:"",description:"",locale:"",select:"vue",order:"vue,react,html",github:"",gitlab:"",theme:"",lightTheme:"",darkTheme:"",stackblitz:"%7B%22show%22%3Afalse%7D",codesandbox:"%7B%22show%22%3Afalse%7D",codeplayer:"%7B%22show%22%3Afalse%7D",files:"%7B%22vue%22%3A%7B%7D%2C%22react%22%3A%7B%7D%2C%22html%22%3A%7B%7D%7D",scope:"",htmlWriteWay:"write",background:"undefined",visible:!0,onMount:s[0]||(s[0]=()=>{l.value=!1}),vueCode:n(B)},m({_:2},[t.value?{name:"vue",fn:p(()=>[a(n(t))]),key:"0"}:void 0]),1032,["vueCode"])]),_:1}),s[4]||(s[4]=A("",4))])}}});export{T as __pageData,x as default};
