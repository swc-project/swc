import * as swcHelpers from "@swc/helpers";
// @strict: true
// @target: es2015
const a = 'a';
function f1(obj) {
    let r0 = swcHelpers.extends({}, obj);
    let { a: a1  } = obj, r1 = swcHelpers.objectWithoutProperties(obj, [
        "a"
    ]);
    let { a: a2 , b: b2  } = obj, r2 = swcHelpers.objectWithoutProperties(obj, [
        "a",
        "b"
    ]);
    let { 'a': a3  } = obj, r3 = swcHelpers.objectWithoutProperties(obj, [
        'a'
    ]);
    let { ['a']: a4  } = obj, r4 = swcHelpers.objectWithoutProperties(obj, [
        'a'
    ]);
    let { [a]: a5  } = obj, r5 = swcHelpers.objectWithoutProperties(obj, [
        a
    ].map(swcHelpers.toPropertyKey));
}
const sa = Symbol();
const sb = Symbol();
function f2(obj) {
    let { [sa]: a1 , [sb]: b1  } = obj, r1 = swcHelpers.objectWithoutProperties(obj, [
        sa,
        sb
    ].map(swcHelpers.toPropertyKey));
}
function f3(obj, k1, k2) {
    let { [k1]: a1 , [k2]: a2  } = obj, r1 = swcHelpers.objectWithoutProperties(obj, [
        k1,
        k2
    ].map(swcHelpers.toPropertyKey));
}
function f4(obj, k1, k2) {
    let { [k1]: a1 , [k2]: a2  } = obj, r1 = swcHelpers.objectWithoutProperties(obj, [
        k1,
        k2
    ].map(swcHelpers.toPropertyKey));
}
