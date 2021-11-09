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
//@target: es5
// Note that type guards affect types of variables and parameters only and 
// have no effect on members of objects such as properties. 
// variables in global
var num;
var strOrNum;
var var1;
var ClassWithAccessors = /*#__PURE__*/ function() {
    "use strict";
    function ClassWithAccessors() {
        _classCallCheck(this, ClassWithAccessors);
    }
    _createClass(ClassWithAccessors, [
        {
            key: "p1",
            get: // Inside public accessor getter
            function get() {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
                return strOrNum;
            },
            set: // Inside public accessor setter
            function set(param) {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // parameter of function declaration
                num = typeof param === "string" && param.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
            }
        },
        {
            key: "pp1",
            get: // Inside private accessor getter
            function get() {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
                return strOrNum;
            },
            set: // Inside private accessor setter
            function set(param) {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // parameter of function declaration
                num = typeof param === "string" && param.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
            }
        }
    ], [
        {
            key: "s1",
            get: // Inside static accessor getter
            function get() {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
                return strOrNum;
            },
            set: // Inside static accessor setter
            function set(param) {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // parameter of function declaration
                num = typeof param === "string" && param.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
            }
        },
        {
            key: "ss1",
            get: // Inside private static accessor getter
            function get() {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
                return strOrNum;
            },
            set: // Inside private static accessor setter
            function set(param) {
                // global vars in function declaration
                num = typeof var1 === "string" && var1.length; // string
                // parameter of function declaration
                num = typeof param === "string" && param.length; // string
                // variables in function declaration
                var var2;
                num = typeof var2 === "string" && var2.length; // string
            }
        }
    ]);
    return ClassWithAccessors;
}();
