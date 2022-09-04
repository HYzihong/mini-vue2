import path from 'path'
import { babel } from '@rollup/plugin-babel';
//    "rollup-plugin-babel": "^4.4.0" 已被废弃
import nodeResolve from '@rollup/plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'
import serve from 'rollup-plugin-serve'
import license from "rollup-plugin-license";
import dts from "rollup-plugin-dts";

const banner = `

MIT License

Copyright (c) 2022 hy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

`


const config = [{
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    name: 'Vue',// global
    format: 'umd',
    // global: 弄个全局变量来接收
    // cjs: module.exports  commonjs模块
    // esm: export default es6模块
    // iife自执行函数 : ()()
    // umd: 兼容 amd + commonjs 不支持es6导入
    sourcemap: true// 可调式
  },
  plugins: [
    nodeResolve({
      extensions: ['.js', '.ts']
    }),
    ts({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }),
    babel(
      {
        exclude: 'node_modules/**',// 忽略
        babelHelpers: 'bundled'
      }
    ),
    serve({
      port: 3000,
      contentBase: '', // 表示起的服务是在根目录下
      openPage: '/public/index.html', // 打开的是哪个文件
      open: true // 默认打开浏览器
    }),
    license({
      banner: banner
    })
  ]
},
// types
{
  input: "types/index.d.ts",
  output: [
    { file: "dist/index.d.ts", format: "esm" },
  ],
  plugins: [
    dts(),
  ],
}
]

export default config;