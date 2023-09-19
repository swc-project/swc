//// [taggedTemplateStringsTypeArgumentInferenceES6.ts]
// Generic tag with one parameter
// Generic tag with argument of function type whose parameter is not of type parameter type but body/return type uses type parameter
function someGenerics3(strs, producer) {}
// 2 parameter generic tag with argument 1 of type parameter type and argument 2 of function type whose parameter is of type parameter type
function someGenerics4(strs, n, f) {}
// 2 parameter generic tag with argument 2 of type parameter type and argument 1 of function type whose parameter is of type parameter type
function someGenerics5(strs, n, f) {}
// Generic tag with multiple arguments of function types that each have parameters of the same generic type
function someGenerics6(strs, a, b, c) {}
// Generic tag with multiple arguments of function types that each have parameters of different generic type
function someGenerics7(strs, a, b, c) {}
someGenerics3`${()=>''}`, someGenerics3`${()=>void 0}`, someGenerics3`${()=>3}`, someGenerics4`${4}${()=>null}`, someGenerics4`${''}${()=>3}`, someGenerics4`${null}${null}`, someGenerics5`${4} ${()=>null}`, someGenerics5`${''}${()=>3}`, someGenerics5`${null}${null}`, someGenerics6`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics6`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics6`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics7`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics7`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics7`${(n)=>n}${(n)=>n}${(n)=>n}`;
var anyVar, x = // Generic tag with argument of generic function type
(function(strs, n) {
    return n;
})`${someGenerics7}`;
// Generic tag with multiple parameters of generic type passed arguments with no best common type
function someGenerics9(strs, a, b, c) {
    return null;
}
x`${null}${null}${null}`, someGenerics9`${''}${0}${[]}`, someGenerics9`${void 0}${{
    x: 6,
    z: new Date()
}}${{
    x: 6,
    y: ''
}}`, someGenerics9`${{
    x: 3
}}${{
    x: 6
}}${{
    x: 6
}}`, someGenerics9`${7}${anyVar}${4}`, someGenerics9`${[]}${null}${void 0}`;
