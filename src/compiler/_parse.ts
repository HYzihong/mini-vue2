import { DomHandler, Parser } from 'htmlparser2';

// const parser = new Parser({
// onreset() {
//   console.info('reset');
// },
// onopentag(name, attribs) { // 解析tag标签触发，标签名称、属性
//   console.info('opentag', name);
//   console.info('attribs', attribs);
// },
// ontext(text) {
//   console.info('text', text);
// },
// onclosetag(tagname) {
//   console.info('closetag', tagname)
// },
// onopentagname(name) {// 解析tag标签触发，标签名称
//   console.info('opentagname', name)
// },
// onattribute(name, value) {
//   console.log('onattribute', name, value);
// },
// onend() {
//   console.info('onend');
// },
// oncomment(val) {
//   console.info('comment', val);
// },
// oncommentend() {
//   console.info('commentend');
// },
// oncdatastart() {
//   console.info('oncdatastart');
// },
// oncdataend() {
//   console.info('oncdataend');
// },
// onprocessinginstruction(name, data) {
//   console.info('onprocessinginstruction', name);
//   console.info('onprocessinginstruction', data);
// }
// }, {
//   recognizeCDATA: true
// })


const parser = new Parser(new DomHandler((err, dom) => {
  console.info(dom);
}), {
  recognizeCDATA: true
})

export function parseHTML(html: string) {
  parser.parseComplete(html);
}