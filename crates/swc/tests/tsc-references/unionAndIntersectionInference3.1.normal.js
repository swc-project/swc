//// [unionAndIntersectionInference3.ts]
// Repro from #30720
concatMaybe([
    1,
    2,
    3
], 4);
// Repros from #32247
const g = async (com)=>{
    throw com;
};
f1 = f2;
f2 = f1;
g1 = g2;
g2 = g1;
let x1 = foo1(sa); // string
let y1 = foo1(sx); // string
let x2 = foo2(sa); // unknown
let y2 = foo2(sx); // { extra: number }
withRouter(MyComponent);
let z = foo(ab); // [AB<string>, string]
a = b;
export { };
