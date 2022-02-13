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
var MyTestClass = function() {
    "use strict";
    function MyTestClass() {
        _classCallCheck(this, MyTestClass), this.someFunc = function() {}, this.canary, this.canary = 3;
    }
    return _createClass(MyTestClass, [
        {
            key: "memberFunc",
            value: function() {
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
            }
        },
        {
            key: "prop",
            get: function() {
                return this;
            },
            set: function(v) {}
        }
    ], [
        {
            key: "staticFn",
            value: function() {
                var t, p, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this, t = MyTestClass;
                t.staticCanary;
                var p = this, p = MyTestClass;
                p.staticCanary;
            }
        },
        {
            key: "staticProp",
            get: function() {
                var p, p = this, p = MyTestClass;
                return p.staticCanary, this;
            },
            set: function(v) {
                var p, p = this, p = MyTestClass;
                p.staticCanary;
            }
        }
    ]), MyTestClass;
}(), MyGenericTestClass = function() {
    "use strict";
    function MyGenericTestClass() {
        _classCallCheck(this, MyGenericTestClass), this.someFunc = function() {}, this.canary, this.canary = 3;
    }
    return _createClass(MyGenericTestClass, [
        {
            key: "memberFunc",
            value: function() {
                arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
            }
        },
        {
            key: "prop",
            get: function() {
                return this;
            },
            set: function(v) {}
        }
    ], [
        {
            key: "staticFn",
            value: function() {
                var t, p, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this, t = MyGenericTestClass;
                t.staticCanary;
                var p = this, p = MyGenericTestClass;
                p.staticCanary;
            }
        },
        {
            key: "staticProp",
            get: function() {
                var p, p = this, p = MyGenericTestClass;
                return p.staticCanary, this;
            },
            set: function(v) {
                var p, p = this, p = MyGenericTestClass;
                p.staticCanary;
            }
        }
    ]), MyGenericTestClass;
}();
this.spaaaaace = 4;
