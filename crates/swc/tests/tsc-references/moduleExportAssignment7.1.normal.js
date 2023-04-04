//// [mod.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Thing = function Thing() {
    "use strict";
    _class_call_check(this, Thing);
    this.x = 1;
};
var AnotherThing = function AnotherThing() {
    "use strict";
    _class_call_check(this, AnotherThing);
    this.y = 2;
};
function foo() {
    return 3;
}
function bar() {
    return 4;
}
/** @typedef {() => number} buz */ module.exports = {
    Thing: Thing,
    AnotherThing: AnotherThing,
    foo: foo,
    qux: bar,
    baz: function baz() {
        return 5;
    },
    literal: ""
};
//// [main.js]
/**
 * @param {import("./mod").Thing} a
 * @param {import("./mod").AnotherThing} b
 * @param {import("./mod").foo} c
 * @param {import("./mod").qux} d
 * @param {import("./mod").baz} e
 * @param {import("./mod").buz} f
 * @param {import("./mod").literal} g
 */ function jstypes(a, b, c, d, e, f, g) {
    return a.x + b.y + c() + d() + e() + f() + g.length;
}
/**
 * @param {typeof import("./mod").Thing} a
 * @param {typeof import("./mod").AnotherThing} b
 * @param {typeof import("./mod").foo} c
 * @param {typeof import("./mod").qux} d
 * @param {typeof import("./mod").baz} e
 * @param {typeof import("./mod").buz} f
 * @param {typeof import("./mod").literal} g
 */ function jsvalues(a, b, c, d, e, f, g) {
    return a.length + b.length + c() + d() + e() + f() + g.length;
}
//// [index.ts]
function types(a, b, c, d, e, f, g) {
    return a.x + b.y + c() + d() + e() + f() + g.length;
}
function values(a, b, c, d, e, f, g) {
    return a.length + b.length + c() + d() + e() + f() + g.length;
}
