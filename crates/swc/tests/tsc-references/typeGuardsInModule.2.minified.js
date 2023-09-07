//// [typeGuardsInModule.ts]
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// variables in global
var var1, m1, m2, m3, m11, var2, var3, var21, var31, m31, m32, var4, var5, m33, m4, var22, var32;
m11 = m1 || (m1 = {}), "string" == typeof var1 && var1.length, "string" == typeof var2 && var2.length, Object.defineProperty(m11, "var3", {
    enumerable: !0,
    get: function() {
        return var3;
    },
    set: function(v) {
        var3 = v;
    }
}), Object.defineProperty(m2 || (m2 = {}), "var3", {
    enumerable: !0,
    get: function() {
        return var31;
    },
    set: function(v) {
        var31 = v;
    }
}), m32 = m31 || (m31 = {}), "string" == typeof var1 && var1.length, "string" == typeof var21 && var21.length, "string" == typeof var4 && var4.length, Object.defineProperty(m32, "var5", {
    enumerable: !0,
    get: function() {
        return var5;
    },
    set: function(v) {
        var5 = v;
    }
}), m4 = (m33 = m3 || (m3 = {})).m4 || (m33.m4 = {}), "string" == typeof var1 && var1.length, "string" == typeof var22 && var22.length, Object.defineProperty(m4, "var3", {
    enumerable: !0,
    get: function() {
        return var32;
    },
    set: function(v) {
        var32 = v;
    }
});
