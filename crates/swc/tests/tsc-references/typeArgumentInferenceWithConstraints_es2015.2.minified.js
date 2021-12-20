var anyVar;
function noParams() {
}
function noGenericParams(n) {
}
function someGenerics1(n, m) {
}
function someGenerics2a(n) {
}
function someGenerics2b(n) {
}
function someGenerics3(producer) {
}
function someGenerics4(n, f) {
}
function someGenerics5(n, f) {
}
function someGenerics6(a, b, c) {
}
function someGenerics7(a, b, c) {
}
function someGenerics9(a, b, c) {
    return null;
}
noParams(), noParams(), noParams(), noGenericParams(""), noGenericParams(""), noGenericParams(""), someGenerics1(3, 4), someGenerics1(3, 4), someGenerics1(3, 4), someGenerics1(3, 4), someGenerics2a((n)=>n
), someGenerics2a((n)=>n
), someGenerics2a((n)=>n.substr(0)
), someGenerics2b((n, x)=>n
), someGenerics2b((n, t)=>n
), someGenerics2b((n, t)=>n.substr(t * t)
), someGenerics3(()=>""
), someGenerics3(()=>void 0
), someGenerics3(()=>3
), someGenerics4(4, ()=>null
), someGenerics4("", ()=>3
), someGenerics4("", (x)=>""
), someGenerics4(null, null), someGenerics5(4, ()=>null
), someGenerics5("", ()=>3
), someGenerics5("", (x)=>""
), someGenerics5(null, null), someGenerics6((n)=>n
, (n)=>n
, (n)=>n
), someGenerics6((n)=>n
, (n)=>n
, (n)=>n
), someGenerics6((n)=>n
, (n)=>n
, (n)=>n
), someGenerics6((n)=>n
, (n)=>n
, (n)=>n
), someGenerics7((n)=>n
, (n)=>n
, (n)=>n
), someGenerics7((n)=>n
, (n)=>n
, (n)=>n
), someGenerics7((n)=>n
, (n)=>n
, (n)=>n
), someGenerics7(null, null, null), someGenerics9("", 0, []), someGenerics9({
    a: 0
}, {
    b: ""
}, null), someGenerics9(void 0, {
    x: 6,
    z: window
}, {
    x: 6,
    y: ""
}), someGenerics9(void 0, {
    x: 6,
    z: window
}, {
    x: 6,
    y: ""
}), someGenerics9({
    x: 3
}, {
    x: 6
}, {
    x: 6
}), someGenerics9(7, anyVar, 4), someGenerics9([], null, void 0);
