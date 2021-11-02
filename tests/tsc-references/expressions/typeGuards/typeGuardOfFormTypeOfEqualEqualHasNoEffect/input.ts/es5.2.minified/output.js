var obj, strOrNum, strOrBool, numOrBool, strOrC, C = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C);
};
"string" == typeof strOrNum, "boolean" == typeof strOrBool, "number" == typeof numOrBool, (void 0 === strOrC ? "undefined" : (obj = strOrC) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) == "Object";
