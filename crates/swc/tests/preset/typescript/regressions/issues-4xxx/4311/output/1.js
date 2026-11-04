"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TestClass", {
    enumerable: true,
    get: function() {
        return TestClass;
    }
});
const _ts_decorate = require("@swc/helpers/_/_ts_decorate");
const printMemberName = (target, memberName)=>{
    console.log(memberName);
};
class TestClass {
    // moving the decorator below the comment works as expected
    /**
     * some tsdoc comments
     * 
     * Some more comments
     * over
     * multiple
     * lines
     */ async run() {
        return await Promise.resolve(true);
    }
}
_ts_decorate._([
    printMemberName
], TestClass.prototype, "run", null);
