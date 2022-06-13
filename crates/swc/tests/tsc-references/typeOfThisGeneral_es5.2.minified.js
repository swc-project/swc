import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var MyTestClass = function() {
    "use strict";
    function MyTestClass() {
        _class_call_check(this, MyTestClass), this.someFunc = function() {}, this.canary, this.canary = 3;
    }
    return MyTestClass.prototype.memberFunc = function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    }, MyTestClass.staticFn = function() {
        var p, t = (arguments.length > 0 && void 0 !== arguments[0] && arguments[0], MyTestClass);
        t.staticCanary;
        var p = MyTestClass;
        p.staticCanary;
    }, _create_class(MyTestClass, [
        {
            key: "prop",
            get: function() {
                return this;
            },
            set: function(v) {}
        }
    ], [
        {
            key: "staticProp",
            get: function() {
                return MyTestClass.staticCanary, this;
            },
            set: function(v) {
                MyTestClass.staticCanary;
            }
        }
    ]), MyTestClass;
}(), MyGenericTestClass = function() {
    "use strict";
    function MyGenericTestClass() {
        _class_call_check(this, MyGenericTestClass), this.someFunc = function() {}, this.canary, this.canary = 3;
    }
    return MyGenericTestClass.prototype.memberFunc = function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    }, MyGenericTestClass.staticFn = function() {
        var p, t = (arguments.length > 0 && void 0 !== arguments[0] && arguments[0], MyGenericTestClass);
        t.staticCanary;
        var p = MyGenericTestClass;
        p.staticCanary;
    }, _create_class(MyGenericTestClass, [
        {
            key: "prop",
            get: function() {
                return this;
            },
            set: function(v) {}
        }
    ], [
        {
            key: "staticProp",
            get: function() {
                return MyGenericTestClass.staticCanary, this;
            },
            set: function(v) {
                MyGenericTestClass.staticCanary;
            }
        }
    ]), MyGenericTestClass;
}();
this.spaaaaace = 4;
