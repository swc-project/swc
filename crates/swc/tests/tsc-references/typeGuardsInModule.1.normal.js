//// [typeGuardsInModule.ts]
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// variables in global
var num;
var strOrNum;
var var1;
// Inside module
(function(m1) {
    // global vars in function declaration
    num = typeof var1 === "string" && var1.length; // string
    // variables in module declaration
    var var2;
    if (typeof var2 === "string") {
        num = var2.length; // string
    } else {
        num = var2; // number
    }
    if (typeof m1.var3 === "string") {
        strOrNum = m1.var3; // string | number
    } else {
        strOrNum = m1.var3; // string | number
    }
})(m1 || (m1 = {}));
// local module
(function(m2) {
    var var2;
    (function(m3) {
        // global vars in function declaration
        num = typeof var1 === "string" && var1.length; // string
        // local variables from outer module declaration
        num = typeof var2 === "string" && var2.length; // string
        // exported variable from outer the module
        strOrNum = typeof var3 === "string" && var3; // string | number
        // variables in module declaration
        var var4;
        if (typeof var4 === "string") {
            num = var4.length; // string
        } else {
            num = var4; // number
        }
        if (typeof var5 === "string") {
            strOrNum = var5; // string | number
        } else {
            strOrNum = var5; // string | number
        }
    })(m3 || (m3 = {}));
    var m3;
})(m2 || (m2 = {}));
// Dotted module
(function(m3) {
    (function(m4) {
        // global vars in function declaration
        num = typeof var1 === "string" && var1.length; // string
        // variables in module declaration
        var var2;
        if (typeof var2 === "string") {
            num = var2.length; // string
        } else {
            num = var2; // number
        }
        if (typeof var3 === "string") {
            strOrNum = var3; // string | number
        } else {
            strOrNum = var3; // string | number
        }
    })(m3.m4 || (m3.m4 = {}));
})(m3 || (m3 = {}));
var m1, m2, m3;
