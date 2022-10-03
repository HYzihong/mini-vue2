import { parseHTML } from "./parse";
export function compileToFunction(template: string) {
  console.log('template ==>', template);
  //  1. 将template 转化成 ast语法树
  let ast = parseHTML(template)

  console.log('ast node tree ==>', ast);

  // 2. 生成render方法 ，返回虚拟dom
}
