import { observe } from "./observe/index.js"

// 初始化状态
export function initState(vm: any) {
  const opts = vm.$options   // 获取到所有属性
  // if (opts.props) {
  //   initProps()
  // }
  if (opts.data) {
    initData(vm) // 初始化数据
  }
}

// 属性代理
function proxy(vm: any, target: any, key: any) {
  // console.log(vm, target, key);
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key]
    },
    set(newValue) {
      vm[target][key] = newValue
    }
  })
}

// 初始化数据
function initData(vm: any) {
  let data = vm.$options.data// 用户传入的对象

  // data 可能是函数 可能是对象

  // @ts-iginro
  data = typeof data === 'function' ? data.call(this) : data

  // 把返回的data也放到Vue实例上 ，用户进行调用的操作
  vm._data = data

  // console.log(data);
  // 对数据进行观测劫持，定义成响应式
  observe(data)

  // 代理vm._data到vm上
  // proxy(vm, "_data")
  for (const key in data) {
    proxy(vm, "_data", key)
  }

}