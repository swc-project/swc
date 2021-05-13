// @target: ES5, ES2015, esnext

function tag (str: any, ...args: any[]): any {
  return str
}

const a = tag`123`
const b = tag`123 ${100}`
const x = tag`\u{hello} ${ 100 } \xtraordinary ${ 200 } wonderful ${ 300 } \uworld`;
const y = `\u{hello} ${ 100 } \xtraordinary ${ 200 } wonderful ${ 300 } \uworld`; // should error with NoSubstitutionTemplate
const z = tag`\u{hello} \xtraordinary wonderful \uworld` // should work with Tagged NoSubstitutionTemplate

const a1 = tag`${ 100 }\0` // \0
const a2 = tag`${ 100 }\00` // \\00
const a3 = tag`${ 100 }\u` // \\u
const a4 = tag`${ 100 }\u0` // \\u0
const a5 = tag`${ 100 }\u00` // \\u00
const a6 = tag`${ 100 }\u000` // \\u000
const a7 = tag`${ 100 }\u0000` // \u0000
const a8 = tag`${ 100 }\u{` // \\u{
const a9 = tag`${ 100 }\u{10FFFF}` // \\u{10FFFF
const a10 = tag`${ 100 }\u{1f622` // \\u{1f622
const a11 = tag`${ 100 }\u{1f622}` // \u{1f622}
const a12 = tag`${ 100 }\x` // \\x
const a13 = tag`${ 100 }\x0` // \\x0
const a14 = tag`${ 100 }\x00` // \x00
