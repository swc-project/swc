import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
export var obj = {
    method1: function(p) {
        return p;
    },
    method2: function(p) {
        return p;
    }
};
export var classExpression = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
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
    _class_call_check(this, ClassWithPrivateNamedProperties);
};
export var ClassWithPrivateNamedMethods = function() {
    "use strict";
    function ClassWithPrivateNamedMethods() {
        _class_call_check(this, ClassWithPrivateNamedMethods);
    }
    return ClassWithPrivateNamedMethods.prototype[s] = function() {}, ClassWithPrivateNamedMethods[s] = function() {}, ClassWithPrivateNamedMethods;
}();
export var ClassWithPrivateNamedAccessors = function() {
    "use strict";
    function ClassWithPrivateNamedAccessors() {
        _class_call_check(this, ClassWithPrivateNamedAccessors);
    }
    return _create_class(ClassWithPrivateNamedAccessors, [
        {
            key: s,
            get: function() {}
        },
        {
            key: s,
            set: function(v) {}
        }
    ], [
        {
            key: s,
            get: function() {}
        },
        {
            key: s,
            set: function(v) {}
        }
    ]), ClassWithPrivateNamedAccessors;
}();
