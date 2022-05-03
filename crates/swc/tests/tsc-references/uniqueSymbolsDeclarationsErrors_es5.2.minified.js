import * as swcHelpers from "@swc/helpers";
var _key, _key1, obj = {
    method1: function(p) {
        return p;
    },
    method2: function(p) {
        return p;
    }
};
export { _key1 as _key };
export var classExpression = function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class);
    }
    var _proto = _class.prototype;
    return _proto.method1 = function(p) {
        return p;
    }, _proto.method2 = function(p) {
        return p;
    }, _class;
}();
export function funcInferredReturnType(obj1) {
    return obj1;
}
export var ClassWithPrivateNamedProperties = function() {
    "use strict";
    swcHelpers.classCallCheck(this, ClassWithPrivateNamedProperties);
};
var _s = s, _s1 = s;
export var ClassWithPrivateNamedMethods = function() {
    "use strict";
    function ClassWithPrivateNamedMethods() {
        swcHelpers.classCallCheck(this, ClassWithPrivateNamedMethods);
    }
    return ClassWithPrivateNamedMethods.prototype[_s] = function() {}, ClassWithPrivateNamedMethods[_s1] = function() {}, ClassWithPrivateNamedMethods;
}();
var _s2 = s, _s3 = s, _s4 = s, _s5 = s;
export var ClassWithPrivateNamedAccessors = function() {
    "use strict";
    function ClassWithPrivateNamedAccessors() {
        swcHelpers.classCallCheck(this, ClassWithPrivateNamedAccessors);
    }
    return swcHelpers.createClass(ClassWithPrivateNamedAccessors, [
        {
            key: _s2,
            get: function() {}
        },
        {
            key: _s3,
            set: function(v) {}
        }
    ], [
        {
            key: _s4,
            get: function() {}
        },
        {
            key: _s5,
            set: function(v) {}
        }
    ]), ClassWithPrivateNamedAccessors;
}();
