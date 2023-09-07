//// [typeGuardsInModule.ts]
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// variables in global
var num;
var strOrNum;
var var1;
var m1;
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
    var var3;
    // exported variable in the module
    Object.defineProperty(m1, "var3", {
        enumerable: true,
        get: function get() {
            return var3;
        },
        set: function set(v) {
            var3 = v;
        }
    });
    if (typeof var3 === "string") {
        strOrNum = var3; // string | number
    } else {
        strOrNum = var3; // string | number
    }
})(m1 || (m1 = {}));
var m2;
// local module
(function(m2) {
    var var2;
    var var3;
    Object.defineProperty(m2, "var3", {
        enumerable: true,
        get: function get() {
            return var3;
        },
        set: function set(v) {
            var3 = v;
        }
    });
    var m3;
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
        var var5;
        // exported variable in the module
        Object.defineProperty(m3, "var5", {
            enumerable: true,
            get: function get() {
                return var5;
            },
            set: function set(v) {
                var5 = v;
            }
        });
        if (typeof var5 === "string") {
            strOrNum = var5; // string | number
        } else {
            strOrNum = var5; // string | number
        }
    })(m3 || (m3 = {}));
})(m2 || (m2 = {}));
var m3;
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
        var var3;
        // exported variable in the module
        Object.defineProperty(m4, "var3", {
            enumerable: true,
            get: function get() {
                return var3;
            },
            set: function set(v) {
                var3 = v;
            }
        });
        if (typeof var3 === "string") {
            strOrNum = var3; // string | number
        } else {
            strOrNum = var3; // string | number
        }
    })(m3.m4 || (m3.m4 = {}));
})(m3 || (m3 = {}));
