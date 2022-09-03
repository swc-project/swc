//// [typeGuardsAsAssertions.ts]
var cond;
export var none = {
    none: ""
};
export function isSome(value) {
    return "some" in value;
}
function someFrom(some) {
    return {
        some: some
    };
}
export function fn(makeSome) {
    for(var result = none; cond;)result = someFrom(isSome(result) ? result.some : makeSome());
}
function foo1() {
    for(var x = 0; cond;)x = "string" == typeof x ? x.slice() : "abc";
}
function foo2() {
    for(var x = 0; cond;)x = "string" == typeof x ? x.slice() : "abc";
}
function f1() {}
function f2() {}
function f3() {}
function f4() {}
function f5(x) {}
function f6() {
    var x;
    x.slice(), (x = "").slice(), (x = void 0).slice(), (x = null).slice(), (x = void 0).slice(), (x = "").slice(), (x = "").slice();
}
function f7() {
    (void 0).slice();
}
