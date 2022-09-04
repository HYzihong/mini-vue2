//  为什么vue2只支持ie9以上，因为低版本的ie不支持 Object.defineProperty 所以只能用垫片做兼容
//  vue3 Proxy 是 es6的语法，也不支持低版本

import { initMixin } from "./init"


// 第一步，先实现响应式的数据 ，数据变化可以被监听

// 为什么不用class，而是用function + 原型链的形式，是因为不想把代码都耦合到一起，方便把所有方法解耦到不同的地方
function Vue(options: any) {
  // @ts-ignore
  this._init(options)
}



initMixin(Vue) // 扩展init方法


export default Vue

