function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// variables in global
var num;
var var1;
var C1 = /*#__PURE__*/ function() {
    "use strict";
    function C1(param) {
        _classCallCheck(this, C1);
        // global vars in function declaration
        num = typeof var1 === "string" && var1.length; // string
        // variables in function declaration
        var var2;
        num = typeof var2 === "string" && var2.length; // string
        // parameters in function declaration
        num = typeof param === "string" && param.length; // string
    }
    _createClass(C1, [
        {
            key: "p1",
            value: // Inside function declaration
            function p1(param) {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
                // parameters in function declaration
                num = typeof param === "string" && param.length; // string
            }
        },
        {
            // Inside function declaration
            key: "p2",
            value: function p2(param) {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
                // parameters in function declaration
                num = typeof param === "string" && param.length; // string
            }
        }
    ], [
        {
            key: "s1",
            value: // Inside function declaration
            function s1(param) {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
                // parameters in function declaration
                num = typeof param === "string" && param.length; // string
            }
        },
        {
            key: "s2",
            value: // Inside function declaration
            function s2(param) {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
                // parameters in function declaration
                num = typeof param === "string" && param.length; // string
            }
        }
    ]);
    return C1;
}();
