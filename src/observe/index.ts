import { arrayMethods } from "./array.js"

class Observe {
  constructor(data) {

    // data.__ob__ == this// __ob__ 就是Observe实例，也可以作为是否被监听的标志
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false// 不可枚举的，循环无法获取到
    })
    // 判断是否是数组
    //我们在修改数组的操作中很少使用的索引进行操作，而且当数组的length过大时对于性能也会更加浪费
    // 我们一般操作数组都会使用push 等方法
    if (Array.isArray(data)) {
      /*
      核心：
      1. 重写数组的方法
        a. 需要在新增删除替换时对新增的数据进行观测劫持
      2. 对数组的每一项进行观测劫持
      */

      // 重写数组方法
      // @ts-ignore
      data.__proto__ = arrayMethods // 在保存数组的原有功能下进行重写方法

      // 劫持每个数组元素，如果元素是对象会被劫持
      this.observeArray(data)
    } else {
      // Object.defineProperty 只能劫持已存在的属性，不能劫持未存在的属性 也就是说删除 新增数据 vue无法检测到 所以有api $set $delete
      this.walk(data)
    }

  }
  walk(data: any) {// 循环给数据属性添加劫持
    // 重新定义数据为响应式
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }
  observeArray(data: any) { // 监听数组对象
    // data.forEach(item => observe(item))
    for (let i = 0, len = data.length; i < len; i++) {
      observe(data[i])
    }
  }
}

// 属性劫持
function defineReactive(target: any, key: any, value: any) {

  // 递归，实现属性深度劫持
  // 对所有的对象进行属性劫持,value不是对象的话会被直接return掉
  if (typeof value === 'object') {
    observe(value)
  }

  // 特别注意：传入的外部变量value，不能被销毁，相当于闭包处理
  Object.defineProperty(target, key, {
    get() {
      console.log(`用户对 ${key} 进行取值了 , value =  ${typeof value === 'object' ? JSON.stringify(value) : value}`);
      return value
    },
    set(newValue) {
      console.log(`用户对 ${key} 进行新赋值了 , new value = ${newValue}`);
      if (newValue === value) return
      value = newValue
    }
  })
}
export function observe(data: any) {

  // 只对对象进行劫持
  if (typeof data !== 'object' || data === null) { return; }

  // 已经被监听的
  if (data.__ob__ instanceof Observe) { return }

  // 需要判断是否对象已经被劫持？新增一个flag属性判断 
  return new Observe(data)

}