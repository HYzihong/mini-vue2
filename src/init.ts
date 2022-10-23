import { compileToFunction } from "./compiler/index.js"
import { initState } from "./initState.js"

export function initMixin(Vue: any) { // initMixin 方便在原型上扩展功能
  Vue.prototype._init = function (options: any) {

    const vm = this
    vm.$options = options // 把options挂载在Vue实例上，方便其他方法调用 $ 表明是vue自己的属性

    // 初始化状态
    initState(vm)

    // 数据挂载
    if (options.el) {
      vm.$mount(options.el)
    }
  }

  // 挂载数据
  Vue.prototype.$mount = function (el: any) {
    const vm = this
    el = document.querySelector(el)
    const ops = vm.$options
    if (!ops.render) {//第一步=先看有没有render函数
      let template
      if (!ops.template || ops.el) {//在看有没有templat模板，没有模板再看有没有el
        console.log(ops.el);
        template = el.outerHTML
      } else {
        if (el) {
          template = ops.template
        }
      }
      if (template) { // 如果存在template 就 使用 template 进行解析编译
        const render = compileToFunction(template)
        ops.render = render
        // jsx 最终会被解析成 h()函数
      }
    }
  }
}
