import { parseHTML } from "./parse";
// import { parseHTML } from './_parse'
import { nodeAttrsType, nodeChildrenType, nodeELementType, nodeElementTypeEnum, nodeTextType } from "./type";

/**
 * 生成attr属性的结构
 * @param attrs 属性值
 */
function genProps(attrs: nodeAttrsType[]) {
  // console.log('attrs ==>', JSON.stringify(attrs));// {name,value}
  let str = ``
  for (let index = 0; index < attrs.length; index++) {
    if (attrs[index].name === 'style') {
      let obj = {}
      // 这里相当于第三方包qs的实现
      attrs[index].value.split(';').forEach((style: string) => {
        // console.log('style ==>', style);
        if (style) {
          let [key, value] = style.split(':')
          obj[key] = value
        }
      });
      attrs[index]['value'] = obj
    }
    // console.log('style ==>', obj);
    // str += `style:${JSON.stringify(obj)}`
    // } else {
    // str += `${attrs[index]['name']}:${attrs[index]['value']},`
    str += `${attrs[index]['name']}:${JSON.stringify(attrs[index]['value'])},`
    // }
  }
  return `{${str.slice(0, -1)}}`// 删除最后一个,
}

/**
 * 生成节点
 * @param node 节点
 * @returns 
 */
function gen(node: nodeChildrenType) {
  // console.log('node', node);
  if (node.type === nodeElementTypeEnum.ELEMENT_TYPE) { // element
    return codegen(node)
  } else { // text
    // console.log('纯文本！！！', node);
    let text: string = (node as nodeTextType).text
    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配{{}} 中间可能是有换行or回车
    // if (!defaultTagRE.test((node as nodeTextType).text)) {
    //   // _v 创建文本的
    //   // _s 是JSON.stringify
    //   return `_v(${JSON.stringify((node as nodeTextType).text)})`
    // }
    if (!defaultTagRE.test(text)) { // 纯文本
      // _v 创建文本的
      // _s 是JSON.stringify
      return `_v(${JSON.stringify(text)})` // 用JSON.stringify给text的字符串加上双引号
    } else { // 双向绑定 {{}}
      let token = []
      let match: RegExpExecArray
      let lastIndex = 0
      defaultTagRE.lastIndex = 0
      while (match = defaultTagRE.exec(text)) {

        let index = match.index

        // console.log(index, match);

        if (index > lastIndex) { // 两个 {{}} 和 {{}} 有文本内容
          token.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        token.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) { // 匹配{{}}后面的文本内容
        token.push(JSON.stringify(text.slice(lastIndex)))
      }
      // console.log('token ==>', token);
      return `_v(${token.join('+')})`

    }
  }
}

/**
 * 生成子节点 
 * @param children 子节点
 * @returns 
 */
function genChildren(children: nodeChildrenType[]) {
  // console.log('children ==>', children);
  // const children = ele.children
  // if(children){
  //   return children.map(child=>genProps(().attrs))
  // }
  if (children) {
    return children.map(child => gen(child)).join(',')
  }
}

/**
 * 生成虚拟dom
 * @param ast ast节点
 */
function codegen(ast: nodeELementType) {
  let children = genChildren(ast.children)
  // console.log('children ==>', children);
  // _c创建元素的
  let code = `
    _c(
      '${ast.tag}',
      ${ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'}
      ${ast.children.length > 0 ? `,${children}` : ''}
    )
  `
  return code
}


export function compileToFunction(template: string) {
  console.log('template ==>', template);

  //  1. 将template 转化成 ast语法树
  let ast = parseHTML(template)

  // console.log('ast node tree ==>', ast);

  // 2. 生成render方法 ，返回虚拟dom
  /*
    render(h){
      return h('div',{id:'app'},)
    }
  */
  let code = codegen(ast)
  console.log('codegen ast template code ==>', code);
  // 模板引擎的实现原理是 with（改变作用域） + new Function
  code = `with(this){return ${code}}`
  let render = new Function(code)// 根据code生成render函数
  console.log('render ==>', render.toString());

  return render
}
