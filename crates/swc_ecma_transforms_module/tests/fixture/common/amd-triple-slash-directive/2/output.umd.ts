///<amd-module name='FirstModuleName'/>
///<amd-module name='SecondModuleName'/>
(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory();
    else if (typeof define === "function" && define.amd) define([], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory();
})(this, function() {
    "use strict";
    class Foo {
        x;
        constructor(){
            this.x = 5;
        }
    }
    module.exports = Foo;
});
