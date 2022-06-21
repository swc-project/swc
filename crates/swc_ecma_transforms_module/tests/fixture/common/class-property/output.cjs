"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Foo", {
    get: ()=>Foo,
    enumerable: true
});
var _simple = require("./files_with_swcrc/simple");
class Foo {
    static prop = _simple.a;
}
