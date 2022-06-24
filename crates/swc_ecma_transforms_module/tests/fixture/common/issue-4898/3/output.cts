"use strict";
const _assert = require("assert");
_assert(true);
module Foo {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "Baz", {
        get: ()=>Baz,
        enumerable: true
    });
    const Baz = 42;
}
console.log(Bar.Baz);
