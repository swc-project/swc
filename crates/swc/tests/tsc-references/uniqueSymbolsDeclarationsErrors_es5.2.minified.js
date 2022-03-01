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
export function funcInferredReturnType(obj1) {
    return obj1;
}
export var ClassWithPrivateNamedProperties = function() {
    "use strict";
    _classCallCheck(this, ClassWithPrivateNamedProperties);
};
var _s = s, _s1 = s;
export var ClassWithPrivateNamedMethods = function() {
    "use strict";
    function ClassWithPrivateNamedMethods() {
        _classCallCheck(this, ClassWithPrivateNamedMethods);
    }
    return _createClass(ClassWithPrivateNamedMethods, [
        {
            key: _s,
            value: function() {}
        }
    ], [
        {
            key: _s1,
            value: function() {}
        }
    ]), ClassWithPrivateNamedMethods;
}();
var _s2 = s, _s3 = s, _s4 = s, _s5 = s;
export var ClassWithPrivateNamedAccessors = function() {
    "use strict";
    function ClassWithPrivateNamedAccessors() {
        _classCallCheck(this, ClassWithPrivateNamedAccessors);
    }
    return _createClass(ClassWithPrivateNamedAccessors, [
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
