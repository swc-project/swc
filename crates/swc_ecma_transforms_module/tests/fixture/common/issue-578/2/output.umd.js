(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./dep.js"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./dep.js"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.depJs);
})(this, function(_depJs) {
    "use strict";
    class SomeClass {
        constructor(properties){
            this.props = properties;
        }
        call() {
            const { myFunction  } = this.props;
            if (myFunction) {
                myFunction();
            } else {
                console.log("DID NOT WORK!");
            }
        }
    }
    let instance = new SomeClass({
        myFunction: ()=>{
            console.log("CORRECT FUNCTION CALLED");
        }
    });
    instance.call();
});
