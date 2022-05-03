import * as swcHelpers from "@swc/helpers";
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
        swcHelpers.classCallCheck(this, _class);
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
    swcHelpers.classCallCheck(this, ClassWithPrivateNamedProperties);
};
var _s = s, _s1 = s;
export var ClassWithPrivateNamedMethods = /*#__PURE__*/ function() {
    "use strict";
    function ClassWithPrivateNamedMethods() {
        swcHelpers.classCallCheck(this, ClassWithPrivateNamedMethods);
    }
    var _proto = ClassWithPrivateNamedMethods.prototype;
    _proto[_s] = function() {};
    ClassWithPrivateNamedMethods[_s1] = function() {};
    return ClassWithPrivateNamedMethods;
}();
var _s2 = s, _s3 = s, _s4 = s, _s5 = s;
export var ClassWithPrivateNamedAccessors = /*#__PURE__*/ function() {
    "use strict";
    function ClassWithPrivateNamedAccessors() {
        swcHelpers.classCallCheck(this, ClassWithPrivateNamedAccessors);
    }
    swcHelpers.createClass(ClassWithPrivateNamedAccessors, [
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
