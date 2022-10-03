// 运行时和全量时 多了这个编译方法
// 实现跟 htmlparser2 差不多的功能
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`

const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)//匹配开始标签的名称
const startTagClose = /^\s*(\/?)>/
// 匹配标签的开始标签 
// example : <div> <br/>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)// > or />
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配到的内容就是我们表达式的变量
// 把属性进行分组匹配
//  第一组匹配的是属性名 key 第二组是 = 第三组or第四组or第n组匹配的是值 value
// example : x="xxx" x='xxx' x=xxx
// 因为标签中的属性的值可以包括在双引号中 ， 单引号中 or 什么也不加中
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配{{}} 中间可能是有换行or回车

interface nodeAttrsType {
  name: string, value: any
}

enum nodeElementTypeEnum {
  ELEMENT_TYPE = 1,
  TEXT_TYPE = 3
}

type nodeChildrenType = nodeELementType | nodeTextType

interface nodeELementType {
  tag?: string,
  type?: nodeElementTypeEnum,
  attrs?: nodeAttrsType[],
  children?: nodeChildrenType[] | [],
  parent?: nodeELementType | null
}

interface nodeTextType extends nodeELementType {
  type?: nodeElementTypeEnum.TEXT_TYPE,
  text?: string
}

// 解析html
// 每解析一个字符串删除一个字符串
function parseHTML(html: string) {

  // type
  const ELEMENT_TYPE: nodeElementTypeEnum.ELEMENT_TYPE = 1
  const TEXT_TYPE: nodeElementTypeEnum.ELEMENT_TYPE = 3


  // 使用栈来输出ast树
  const stack = [] // 存放元素的栈
  let currentParent: nodeELementType; // 存放当前指向的父元素,永远指向栈中的最后一个元素
  let root: nodeELementType;//根节点

  // 最终需要转换成一颗抽象语法树
  /*
  {
    tag:'div',
    type:1,
    attrs:[{name,age,address}],
    parent:null,
    children:[

    ],
    //
  }
  */

  function createASTElement(tag: string, attrs: nodeAttrsType[]): nodeELementType {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    } as nodeELementType
  }


  function start(tagName: string, attrs: nodeAttrsType[]): void {
    // console.log('start tagName ==> :', tagName);
    // console.log('start attrs ==> :', attrs);

    let node = createASTElement(tagName, attrs) // 创造一个一个ast节点
    if (!root) {   // 如果根节点为空
      root = node
    }
    if (currentParent) { // 如果当前有指向的父节点，说明当前节点是当前指向的父节点的子节点
      node.parent = currentParent as nodeELementType
      (currentParent.children as nodeChildrenType[]).push(node)
    }

    // 入栈
    stack.push(node)

    currentParent = node // 当前的临时父节点指向当前创建的节点
  }

  function chars(text: string): void {// 文本内容直接放到当前指向的节点，当识别到标签结束会
    // console.log('chars text ==>', text);
    if (text && text.replace(/\s/g, '')) {
      (currentParent.children as nodeChildrenType[]).push(
        {
          type: TEXT_TYPE,
          text,
          parent: currentParent
        } as nodeChildrenType
      )
    }
  }

  // 
  function end(tagName: string) { // 遇到当前标签的节点闭合标签，让当前节点出栈，同时替换当前指向的父节点
    // console.log('end tagName ==>', tagName);
    // let node = stack.pop()
    stack.pop()
    // console.log(node);
    currentParent = stack[stack.length - 1] // 当前指向的父节点，指向上一层的节点
  }

  // 匹配当前字符串，截取
  function advance(len: number) {
    html = html.substring(len)
    // console.log('html ==>', html);
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match: {
        tagName: string
        attrs: nodeAttrsType[]
      } = {
        tagName: start[1], // 分组：标签名
        attrs: []
      }
      // console.log('match ==>', match);
      // console.log('start ==>', start);
      // console.log('start[0] ==>', start[0]);
      advance(start[0].length)// 删除开始标签
      let attrs: RegExpMatchArray; // 保存当前标签里面的属性
      let end: RegExpMatchArray;// 不是当前开始标签的结束标签
      // console.log('is end', html.match(startTagClose));
      // console.log('is attr', html.match(attribute));
      /*
        0: " id=\"app\""
        1: "id"
        2: "="
        3: "app"
        4: undefined
        5: undefined
        groups: undefined
        index: 0
        input: " id=\"app\">\n    <h1>name - {{name}}</h1>\n    <div>\n      age - {{age}}\n    </div>\n  </div>"
        length: 6
      */
      while (
        !(end = html.match(startTagClose))// 如果不是开始标签的结束 就一直匹配下去
        && (attrs = html.match(attribute)) // 每次匹配的结果都放到attrs
      ) {
        advance(attrs[0].length)
        // console.log('attrs ==>', attrs);

        match.attrs.push({
          name: attrs[1],
          value: attrs[3] || attrs[4] || attrs[5] || true
        })
      }

      if (end) {
        advance(end[0].length) // 删除 结束标签 >
      }
      // console.log('match 999 ==>', match);
      return match
    }
    return false // 当前不是开始标签
  }

  while (html) {
    let textEnd = html.indexOf('<')
    // 0 说明当前是标签的开始是一个<,也说明当前是标签  
    // 当前为0时，说明当前是标签的开始or结束
    // 当前不为0时，说明当前是标签的结束
    // vue3 可以直接使用字符串，不需要标签
    if (textEnd == 0) { // 匹配开始标签
      const startTagMatch = parseStartTag()// 开始标签的匹配
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        // console.log('startTagMatch ==>', startTagMatch);
        continue
      }
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[0])
        continue
      }
    }
    if (textEnd > 0) { // 解析到的文本内容
      let text = html.substring(0, textEnd)//文本内容的截取
      if (text) {
        advance(text.length)
        chars(text)
        // console.log('text ==>', text);
      }
    }
  }
  // console.log('html 999 ==>', html);
  // console.log('root ==>', root);
  return root
}


// function parseStartTag(html: string) {
//   const start = html.match(startTagOpen)
//   return start
// }

export function compileToFunction(template: string) {

  console.log('template ==>', template);

  //  1. 将template 转化成 ast语法树
  let ast = parseHTML(template)

  console.log('ast node tree ==>', ast);



  // 2. 生成render方法 ，返回虚拟dom
}



// 关于为什么不用 document.createDocumentFragment() 文档碎片 处理，而是用 正则匹配
// 因为当前我们进行的是 语法层面的转译 而不是dom层面的转译
// 而且 不好进行性能优化