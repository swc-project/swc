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
            get: all[name]
        });
    }
    _export(exports, {
        x: function() {
            return x;
        },
        y: function() {
            return y;
        },
        f1: function() {
            return f1;
        },
        f2: function() {
            return f2;
        },
        f3: function() {
            return f3;
        },
        f4: function() {
            return f4;
        }
    });
    let x = 0;
    let y = 0;
    function f1() {
        ({ x  } = {
            x: 1
        });
    }
    function f2() {
        ({ x , y  } = {
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
