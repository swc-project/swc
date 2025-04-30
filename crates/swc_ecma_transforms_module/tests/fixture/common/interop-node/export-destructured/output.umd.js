(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {});
})(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get f1 () {
            return f1;
        },
        get f2 () {
            return f2;
        },
        get f3 () {
            return f3;
        },
        get f4 () {
            return f4;
        },
        get x () {
            return x;
        },
        get y () {
            return y;
        }
    });
    let x = 0;
    let y = 0;
    function f1() {
        ({ x } = {
            x: 1
        });
    }
    function f2() {
        ({ x, y } = {
            x: 2,
            y: 3
        });
    }
    function f3() {
        [x, y, z] = [
            3,
            4,
            5
        ];
    }
    function f4() {
        [x, , y] = [
            3,
            4,
            5
        ];
    }
});
