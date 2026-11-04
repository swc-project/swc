"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "moduleA", {
    enumerable: true,
    get: function() {
        return moduleA;
    }
});
const _moduleB = require("../moduleB");
const moduleA = ()=>{
    console.log("This is module A");
    (0, _moduleB.moduleB)();
};
