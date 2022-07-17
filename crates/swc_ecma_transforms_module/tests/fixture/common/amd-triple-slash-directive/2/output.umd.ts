///<amd-module name='FirstModuleName'/>
///<amd-module name='SecondModuleName'/>
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") module.exports = factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) module.exports = factory();
})(this, function() {
    "use strict";
    class Foo {
        x: number;
        constructor(){
            this.x = 5;
        }
    }
    return Foo;
});
