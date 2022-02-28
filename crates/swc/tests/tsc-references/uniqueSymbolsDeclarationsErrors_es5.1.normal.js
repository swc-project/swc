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
    method1: function method1(p) {
        return p;
    },
    method2: function method2(p) {
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
export function funcInferredReturnType(obj1) {
    return obj1;
}
export var ClassWithPrivateNamedProperties = function ClassWithPrivateNamedProperties() {
    "use strict";
    _classCallCheck(this, ClassWithPrivateNamedProperties);
};
var _s = s, _s1 = s;
export var ClassWithPrivateNamedMethods = /*#__PURE__*/ function() {
    "use strict";
    function ClassWithPrivateNamedMethods() {
        _classCallCheck(this, ClassWithPrivateNamedMethods);
    }
    _createClass(ClassWithPrivateNamedMethods, [
        {
            key: _s,
            value: function value() {}
        }
    ], [
        {
            key: _s1,
            value: function value() {}
        }
    ]);
    return ClassWithPrivateNamedMethods;
}();
var _s2 = s, _s3 = s, _s4 = s, _s5 = s;
export var ClassWithPrivateNamedAccessors = /*#__PURE__*/ function() {
    "use strict";
    function ClassWithPrivateNamedAccessors() {
        _classCallCheck(this, ClassWithPrivateNamedAccessors);
    }
    _createClass(ClassWithPrivateNamedAccessors, [
        {
            key: _s2,
            get: function get() {
                return undefined;
            }
        },
        {
            key: _s3,
            set: function set(v) {}
        }
    ], [
        {
            key: _s4,
            get: function get() {
                return undefined;
            }
        },
        {
            key: _s5,
            set: function set(v) {}
        }
    ]);
    return ClassWithPrivateNamedAccessors;
}();
