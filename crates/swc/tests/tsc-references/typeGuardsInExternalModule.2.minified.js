//// [typeGuardsInExternalModule.ts]
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// local variable in external module
var var1, var2;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "var2", {
    enumerable: !0,
    get: function() {
        return var2;
    }
}), "string" == typeof var1 && var1.length;
