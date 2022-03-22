const template_literal1 = `test${"test"}test${"test"}`;
const template_literal2 = ``;
const template_literal3 = ` `;
const template_literal4 = `string text`;
const template_literal5 = `string text line 1
 string text line 2`;
const template_literal6 = `string text ${   expression   } string text`;
const templateFn = expression => `string text ${expression} string text`;
const template_literal7 = example`string text ${expression} string text`;
const template_literal8 = `header ${ isLargeScreen() ? '' : `icon-${item.isCollapsed ? 'expander' : 'collapser'}` }`;
const template_literal9 = `test \u00A9`;
const template_literal10 = `test \u{2F804}`;
const template_literal11 = `test \xA9`;
const template_literal12 = `test \0o251`;

function latex(str) {
    return { "cooked": str[0], "raw": str.raw[0] }
}

const template_literal14 = latex`\unicode`;
const template_literal15 = `\"test\"test\"test`;
const template_literal16 = `\"test\'test\'test`;
const template_literal17 = `\"test\"test\"test`;
const template_literal18 = `\'test\'test\'test`;
const template_literal19 = `\0`;
const template_literal20 = `\x01`;
const template_literal21 = `\0${0}`;
const template_literal22 = `\x01${0}`;
const template_literal23 = `${0}\0`;
const template_literal24 = `${0}\x01`;
const template_literal25 = `${0}\0${1}`;
const template_literal26 = `${0}\x01${1}`;
const template_literal27 = String.raw`\1`;
const template_literal28 = String.raw`\\x01`;
const template_literal29 = String.raw`\\1${0}`;
const template_literal30 = String.raw`\\x01${0}`;
const template_literal31 = String.raw`${0}\\1`;
const template_literal32 = String.raw`${0}\\x01`;
const template_literal33 = String.raw`${0}\\1${1}`;
const template_literal34 = String.raw`${0}\\x01${1}`;
const template_literal35 = `${y}`;
const template_literal36 = `$(y)`;
const template_literal37 = `{y}$`;
const template_literal38 = `$}y{`;
const template_literal39 = `\\${y}`;
const template_literal40 = `$\\{y}`;
await tag`x`;
await (tag`x`);
(await tag)`x`;
await tag`${x}`;
await (tag`${x}`);
(await tag)`${x}`;
new tag`x`;
new (tag`x`);
new tag()`x`;
(new tag)`x`;
new tag`${x}`;
new (tag`${x}`);
new tag()`${x}`;
(new tag)`${x}`;
new tag`${x}`;
new (tag`${x}`);
new tag()`${x}`;
(new tag)`${x}`;
const template_literal41 = `${"test\`"}${'test\"'}${"test\'\'\'"}`;
const template_literal42 = "\u0591-\u06ef\u06fa-\u08ff\u200f\ud802-\ud803\ud83a-\ud83b\ufb1d-\ufdff\ufe70-\ufefc";
const template_literal43 = "A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0900-\u1fff\u200e\u2c00-\ud801\ud804-\ud839\ud83c-\udbff\uf900-\ufb1c\ufe00-\ufe6f\ufefd-\uffff";
const template_literal45 = `xx\`x`;
const template_literal46 = `${ foo + 2 }`;
const template_literal47 = ` foo ${ bar + `baz ${ qux }` }`;
const template_literal48 = `foo
bar
ↂωↂ`;
const template_literal48 = `This is ${undefined}`;
const template_literal49 = `This is ${NaN}`;
const template_literal50 = `This is ${null}`;
const template_literal51 = `This is ${Infinity}`;
const template_literal60 = `${4**11}`;
const template_literal61 = `Hello ${guest()}, welcome to ${location()}${"."}`;
const template_literal62 = `${1}${2}${3}${4}${5}${6}${7}${8}${9}${0}`;
const template_literal63 = `${foobar()}${foobar()}${foobar()}${foobar()}`;
const template_literal64 = `${1}${foobar()}${2}${foobar()}${3}${foobar()}`;
const template_literal65 = "Decimals " + `${1}${2}${3}${4}${5}${6}${7}${8}${9}${0}`;
const template_literal66 = `${`${`${`foo`}`}`}`;
const template_literal67 = `before ${`innerBefore ${any} innerAfter`} after`;
const template_literal68 = `1 ${2 + `3 ${any} 4` + 5} 6`;
const template_literal69 = `</script>${content}`;
const template_literal70 = `<!--`;
const template_literal71 = `-->`;
const template_literal72 = `\u0020\u{20}\u{00020}\x20 `;
console.log(`\\n\\r\\u2028\\u2029\n\r\u2028\u2029`);
function a() {
    return `\
foo`;
}
function b() {
    return `
bar`;
}
function c() {
    return
    `\
baz`;
}
function d() {
    return
    `qux`;
}
function e() {
    return `\nfin`;
}
function x(s) { return s.raw[0]; }
console.log(String.raw`\u`);
console.log(x`\u`);
console.log(String.raw`\unicode \xerces \1234567890`);
let z = () => String.raw;
console.log(z()`\4321\u\x`);
var str = `foo ${'`;\n`${any}'} bar`;
var concat = `foo ${any} bar` + '`;\n`${any}';
var template = `foo ${'`;\n`${any}'} ${any} bar`;
const template_weird = `\xb43`;
const template_literal73 = `\'`;
const template_literal74 = `\"`;
