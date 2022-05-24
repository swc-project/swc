var anyVar;
function someGenerics3(strs, producer) {}
function someGenerics4(strs, n, f) {}
function someGenerics5(strs, n, f) {}
function someGenerics6(strs, a, b, c) {}
function someGenerics7(strs, a, b, c) {}
function someGenerics8(strs, n) {
    return n;
}
function someGenerics9(strs, a, b, c) {
    return null;
}
someGenerics3`${()=>''}`, someGenerics3`${()=>void 0}`, someGenerics3`${()=>3}`, someGenerics4`${4}${()=>null}`, someGenerics4`${''}${()=>3}`, someGenerics4`${null}${null}`, someGenerics5`${4} ${()=>null}`, someGenerics5`${''}${()=>3}`, someGenerics5`${null}${null}`, someGenerics6`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics6`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics6`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics7`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics7`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics7`${(n)=>n}${(n)=>n}${(n)=>n}`, someGenerics8`${someGenerics7}``${null}${null}${null}`, someGenerics9`${''}${0}${[]}`, someGenerics9`${void 0}${{
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
