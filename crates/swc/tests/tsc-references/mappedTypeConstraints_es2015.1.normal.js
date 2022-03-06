import * as swcHelpers from "@swc/helpers";
// @strict: true
function f0(obj) {
    obj.b;
}
function f1(obj) {
    obj.b;
}
function f2(obj) {
    obj.b;
}
function f3(obj) {
    obj.a;
    obj.b;
    obj.c;
}
function f4(obj) {
    obj.a;
    obj.c;
}
const modifier = (targetProps)=>{
    let { bar  } = targetProps, rest = swcHelpers.objectWithoutProperties(targetProps, [
        "bar"
    ]);
    rest.foo;
};
