//// [typeGuardsInExternalModule.ts]
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// local variable in external module
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "var2", {
    enumerable: true,
    get: function() {
        return var2;
    }
});
var num;
var var1;
if (typeof var1 === "string") {
    num = var1.length; // string
} else {
    num = var1; // number
}
// exported variable in external module
var strOrNum;
var var2;
if (typeof var2 === "string") {
    // export makes the var property and not variable
    strOrNum = var2; // string | number
} else {
    strOrNum = var2; // number | string
}
