function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
var obj1 = {
    method1: function(p) {
        return p;
    },
    method2: function(p) {
        return p;
    }
};
export { obj1 as obj };
export var classExpression = function() {
    "use strict";
    function _class() {
        _classCallCheck(this, _class);
    }
    return _createClass(_class, [
        {
            key: "method1",
            value: function(p) {
                return p;
            }
        },
        {
            key: "method2",
            value: function(p) {
                return p;
            }
        }
    ]), _class;
}();
export function funcInferredReturnType(obj) {
    return obj;
}
export var ClassWithPrivateNamedProperties = function() {
    "use strict";
    _classCallCheck(this, ClassWithPrivateNamedProperties);
};
var tmp = s, tmp1 = s;
export var ClassWithPrivateNamedMethods = function() {
    "use strict";
    function ClassWithPrivateNamedMethods() {
        _classCallCheck(this, ClassWithPrivateNamedMethods);
    }
    return _createClass(ClassWithPrivateNamedMethods, [
        {
            key: tmp,
            value: function() {
            }
        }
    ], [
        {
            key: tmp1,
            value: function() {
            }
        }
    ]), ClassWithPrivateNamedMethods;
}();
var tmp2 = s, tmp3 = s, tmp4 = s, tmp5 = s;
export var ClassWithPrivateNamedAccessors = function() {
    "use strict";
    function ClassWithPrivateNamedAccessors() {
        _classCallCheck(this, ClassWithPrivateNamedAccessors);
    }
    return _createClass(ClassWithPrivateNamedAccessors, [
        {
            key: tmp2,
            get: function() {
            }
        },
        {
            key: tmp3,
            set: function(v) {
            }
        }
    ], [
        {
            key: tmp4,
            get: function() {
            }
        },
        {
            key: tmp5,
            set: function(v) {
            }
        }
    ]), ClassWithPrivateNamedAccessors;
}();
