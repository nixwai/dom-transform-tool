# dom-transform-tool

专用于操作 DOM 元素节点变化的工具包，提供了丰富的 API 来实现元素调整位置、尺寸、旋转、缩放等功能。

当前开源的元素变化操作组件有不少，但其功能样式并不一定符合每个开发人员的需求，那么不如抽离其核心的操作功能作为一个工具包来使用。开发人员可以基于该工具包来开发自己的元素变化组件。

# 安装

#### 使用 npm

```shell
npm install dom-transform-tool
```

#### 使用 yarn

```shell
yarn add dom-transform-tool
```

#### 使用 pnpm

```shell
pnpm add dom-transform-tool
```

# 使用

使用ES按需引入

```js
import { domDrag } from 'dom-transform-tool';
```

# 功能介绍

- 为了之后能兼容移动端的，方法调用时使用pointer指针作为触发事件，而不是鼠标；
- 除了使用指针调整，方法也都可以通过manual参数直接手动调整元素的样式；
- 方法调用时会通过target获取对应元素的样式信息，比如最大宽高、最小宽高、旋转、位置信息等，也可通过customStyle参数来自定义样式；
- 每个方法都有提供参数来控制每次调整的数值；
- 元素调整可以有不同的样式控制，如position、transform、translate等等，因此每个方法也将提供一个参数用于选择调整元素时使用的样式；
- 方法的调整单位默认都为px、deg，但你可通过customRender来修改每次调整后的具体数值，如修改为rem、%等；
- 当你希望自己手动调整元素时，可以配置disableUpdate为true，便可在callback回调函数中自己操作元素；
- 结束调整的控制事件默认为指针抬起，如果希望自定义控制结束事件的话可以将disablePointerEnd设置为true，然后通过方法的返回值获取释放函数，自定义处理事件的释放，如（endPointerHandler = domResize()，endPointerHandler为释放函数）；
- ...更多请自行查看文档中API的参数配置
