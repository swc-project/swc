//// [taggedTemplateStringsTypeArgumentInferenceES6.ts]
function noParams(n) {}
function noGenericParams(n) {}
function someGenerics1a(n, m) {}
function someGenerics1b(n, m) {}
function someGenerics2a(strs, n) {}
function someGenerics2b(strs, n) {}
function someGenerics3(strs, producer) {}
function someGenerics4(strs, n, f) {}
function someGenerics5(strs, n, f) {}
function someGenerics6(strs, a, b, c) {}
function someGenerics7(strs, a, b, c) {}
function someGenerics8(strs, n) {
    return n;
}
noParams``, noGenericParams``, someGenerics1a`${3}`, someGenerics1b`${3}`, someGenerics2a`${(n)=>n}`, someGenerics2b`${(n, x)=>n}`, someGenerics3`${()=>''}`, someGenerics3`${()=>void 0}`, someGenerics3`${()=>3}`, someGenerics4`${4}${()=>null}`, someGenerics4`${''}${()=>3}`, someGenerics4`${null}${null}`, someGenerics5`${4} ${()=>null}`, someGenerics5`${''}${()=>3}`, someGenerics5`${null}${null}`, someGenerics6`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics6`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics6`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics7`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics7`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics7`${(n)=>n}${(n)=>n}${(n)=>n}`;
var a9a, a9e, a9d, anyVar, a, arr, x = someGenerics8`${someGenerics7}`;
function someGenerics9(strs, a, b, c) {
    return null;
}
x`${null}${null}${null}`;
var a9a = someGenerics9`${''}${0}${[]}`, a9e = someGenerics9`${void 0}${{
    x: 6,
    z: new Date()
}}${{
    x: 6,
    y: ''
}}`, a9d = someGenerics9`${{
    x: 3
}}${{
    x: 6
}}${{
    x: 6
}}`, a = someGenerics9`${7}${anyVar}${4}`, arr = someGenerics9`${[]}${null}${void 0}`;
