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
var A = function() {
    "use strict";
    _classCallCheck(this, A);
}, B = function() {
    "use strict";
    _classCallCheck(this, B);
}, C = function() {
    "use strict";
    _classCallCheck(this, C);
}, D = function() {
    "use strict";
    _classCallCheck(this, D);
}, AWithOptionalProp = function() {
    "use strict";
    _classCallCheck(this, AWithOptionalProp);
}, BWithOptionalProp = function() {
    "use strict";
    _classCallCheck(this, BWithOptionalProp);
}, ClassWithUnionProp = function() {
    "use strict";
    _classCallCheck(this, ClassWithUnionProp);
}, NestedClassWithProp = function() {
    "use strict";
    _classCallCheck(this, NestedClassWithProp);
}, InMemberOfClass = function() {
    "use strict";
    function InMemberOfClass() {
        _classCallCheck(this, InMemberOfClass);
    }
    return _createClass(InMemberOfClass, [
        {
            key: "inThis",
            value: function() {
                "a" in this.prop ? this.prop.a : this.prop.b;
            }
        }
    ]), InMemberOfClass;
}(), SelfAssert = function() {
    "use strict";
    function SelfAssert() {
        _classCallCheck(this, SelfAssert);
    }
    return _createClass(SelfAssert, [
        {
            key: "inThis",
            value: function() {
                "a" in this && this.a;
            }
        }
    ]), SelfAssert;
}();
