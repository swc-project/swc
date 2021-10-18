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
// not allowed when emitting declarations
export var obj = {
    method1: function(p) {
        return p;
    },
    method2: function(p) {
        return p;
    }
};
export var classExpression = /*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _classCallCheck(this, _class);
    }
    _createClass(_class, [
        {
            key: "method1",
            value: function method1(p) {
                return p;
            }
        },
        {
            key: "method2",
            value: function method2(p) {
                return p;
            }
        }
    ]);
    return _class;
}();
export function funcInferredReturnType(obj) {
    return obj;
}
export var ClassWithPrivateNamedProperties = function ClassWithPrivateNamedProperties() {
    "use strict";
    _classCallCheck(this, ClassWithPrivateNamedProperties);
};
var tmp = s, tmp1 = s;
export var ClassWithPrivateNamedMethods = /*#__PURE__*/ function() {
    "use strict";
    function ClassWithPrivateNamedMethods() {
        _classCallCheck(this, ClassWithPrivateNamedMethods);
    }
    _createClass(ClassWithPrivateNamedMethods, [
        {
            key: tmp,
            value: function value() {
            }
        }
    ], [
        {
            key: tmp1,
            value: function value() {
            }
        }
    ]);
    return ClassWithPrivateNamedMethods;
}();
var tmp3 = s, tmp4 = s, tmp5 = s, tmp6 = s;
export var ClassWithPrivateNamedAccessors = /*#__PURE__*/ function() {
    "use strict";
    function ClassWithPrivateNamedAccessors() {
        _classCallCheck(this, ClassWithPrivateNamedAccessors);
    }
    _createClass(ClassWithPrivateNamedAccessors, [
        {
            key: tmp3,
            get: function get() {
                return undefined;
            }
        },
        {
            key: tmp4,
            set: function set(v) {
            }
        }
    ], [
        {
            key: tmp5,
            get: function get() {
                return undefined;
            }
        },
        {
            key: tmp6,
            set: function set(v) {
            }
        }
    ]);
    return ClassWithPrivateNamedAccessors;
}();
