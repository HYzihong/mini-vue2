import { initState } from "./initState.js"


export function initMixin(Vue: any) { // initMixin 方便在原型上扩展功能
  Vue.prototype._init = function (options: any) {

    const vm = this
    vm.$options = options // 把options挂载在Vue实例上，方便其他方法调用 $ 表明是vue自己的属性

    // 初始化状态
    initState(vm)

  }


}
