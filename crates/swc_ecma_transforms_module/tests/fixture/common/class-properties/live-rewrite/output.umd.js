(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("anywhere"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "anywhere"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.anywhere);
})(this, function(exports, _anywhere) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    class Example {
        #test1 = _anywhere.test1;
        test2 = _anywhere.test2;
         #test3() {
            return _anywhere.test3;
        }
        test4() {
            return _anywhere.test4;
        }
        get #test5() {
            return _anywhere.test5;
        }
        get test6() {
            return _anywhere.test6;
        }
        #test7 = this.#test1;
         #test8() {
            return this.#test3();
        }
        get #test9() {
            return this.#test5();
        }
    }
});
