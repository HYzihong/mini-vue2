// 我们需要重写一些数组的原生方法


const oldArrayProto = Array.prototype // 获取原生的方法，缓存一份

export const arrayMethods = Object.create(oldArrayProto)

/*
Object.create()
Object.create() 方法用于创建一个新对象，使用现有的对象来作为新创建对象的原型（prototype）
也就是 newObject.prototype = oldObject
Object.create(proto[, propertiesObject])

proto
新创建对象的原型对象。

propertiesObject 可选
如果该参数被指定且不为 undefined，则该传入对象的自有可枚举属性（即其自身定义的属性，而不是其原型链上的枚举属性）将为新创建的对象添加指定的属性值和对应的属性描述符。这些属性对应于 Object.defineProperties() 的第二个参数。

返回值
一个新对象，带着指定的原型对象及其属性。
*/

const methods = [ // 所有变异方法（会改变数组的方法）
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

type ArrayMethods =
  'push' |
  'pop' |
  'shift' |
  'unshift' |
  'splice' |
  'sort' |
  'reverse'

methods.forEach(function (method: ArrayMethods) {
  let _method = oldArrayProto[method] // cache old array prototype method

  Object.defineProperty(arrayMethods, method, {
    value: function (...args: any) {
      const result = _method.call(this, ...args) // 内部调用原来的方法，但是进行了函数的劫持，切片编程

      // 我们需要在数组发生变异时把新增替换的删除的内容进行监听
      let inserted: any; // 新增的数据
      let ob = this.__ob__
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args
          break;
        case 'splice':
          inserted = args.slice(2)
      }
      if (inserted) {
        ob.observeArray(inserted)
      }
      return result
    }
  })

  // _method = function (...args) { // 重写数组的方法

  //   const result = oldArrayProto[method].call(this, ...args) // 内部调用原来的方法，但是进行了函数的劫持，切片编程

  //   // 我们需要在数组发生变异时把新增替换的删除的内容进行监听
  //   let inserted; // 新增的数据
  //   let ob = this.__ob__
  //   console.log(ob);
  //   switch (method) {
  //     case 'push':
  //     case 'unshift':
  //       inserted = args
  //       console.log(inserted);
  //       break;
  //     case 'splice':
  //       inserted = args.slice(2)
  //   }
  //   if (inserted) {
  //     console.log(1);
  //     ob.observeArray(inserted)
  //   }


  //   return result
  // }
})

