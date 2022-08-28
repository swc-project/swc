//// [a.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_ts_decorate.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_ts_decorate.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.aTs = {}, global.tsDecorateMjs);
})(this, function(exports, _tsDecorate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>Foo
    });
    _tsDecorate = _tsDecorate.default;
    var decorator;
    let Foo = class Foo {
    };
    Foo = _tsDecorate([
        decorator
    ], Foo);
});
//// [b.ts]
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("@swc/helpers/src/_ts_decorate.mjs"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "@swc/helpers/src/_ts_decorate.mjs"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.bTs = {}, global.tsDecorateMjs);
})(this, function(exports, _tsDecorate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        enumerable: true,
        get: ()=>_class
    });
    _tsDecorate = _tsDecorate.default;
    var decorator;
    let _class = class _class {
    };
    _class = _tsDecorate([
        decorator
    ], _class);
});
