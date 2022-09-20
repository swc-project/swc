//// [a.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_ts_decorate.mjs")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_ts_decorate.mjs"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.aTs = {}, global.tsDecorateMjs);
}(this, function(exports, _tsDecorate) {
    "use strict";
    var decorator;
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: ()=>Foo
    });
    _tsDecorate = _tsDecorate.default;
    let Foo = class {
    };
    Foo = _tsDecorate([
        decorator
    ], Foo);
});
//// [b.ts]
!function(global, factory) {
    "object" == typeof module && "object" == typeof module.exports ? factory(exports, require("@swc/helpers/src/_ts_decorate.mjs")) : "function" == typeof define && define.amd ? define([
        "exports",
        "@swc/helpers/src/_ts_decorate.mjs"
    ], factory) : (global = "undefined" != typeof globalThis ? globalThis : global || self) && factory(global.bTs = {}, global.tsDecorateMjs);
}(this, function(exports, _tsDecorate) {
    "use strict";
    var decorator;
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    Object.defineProperty(exports, "default", {
        enumerable: !0,
        get: ()=>_class
    });
    _tsDecorate = _tsDecorate.default;
    let _class = class {
    };
    _class = _tsDecorate([
        decorator
    ], _class);
});
