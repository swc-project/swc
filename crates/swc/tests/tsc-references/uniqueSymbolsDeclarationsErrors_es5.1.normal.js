import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
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
        _class_call_check(this, _class);
    }
    var _proto = _class.prototype;
    _proto.method1 = function method1(p) {
        return p;
    };
    _proto.method2 = function method2(p) {
        return p;
    };
    return _class;
}();
export function funcInferredReturnType(obj1) {
    return obj1;
}
export var ClassWithPrivateNamedProperties = function ClassWithPrivateNamedProperties() {
    "use strict";
    _class_call_check(this, ClassWithPrivateNamedProperties);
};
export var ClassWithPrivateNamedMethods = /*#__PURE__*/ function() {
    "use strict";
    function ClassWithPrivateNamedMethods() {
        _class_call_check(this, ClassWithPrivateNamedMethods);
    }
    var _proto = ClassWithPrivateNamedMethods.prototype;
    _proto[s] = function() {};
    ClassWithPrivateNamedMethods[s] = function() {};
    return ClassWithPrivateNamedMethods;
}();
export var ClassWithPrivateNamedAccessors = /*#__PURE__*/ function() {
    "use strict";
    function ClassWithPrivateNamedAccessors() {
        _class_call_check(this, ClassWithPrivateNamedAccessors);
    }
    _create_class(ClassWithPrivateNamedAccessors, [
        {
            key: s,
            get: function get() {
                return undefined;
            }
        },
        {
            key: s,
            set: function set(v) {}
        }
    ], [
        {
            key: s,
            get: function get() {
                return undefined;
            }
        },
        {
            key: s,
            set: function set(v) {}
        }
    ]);
    return ClassWithPrivateNamedAccessors;
}();
