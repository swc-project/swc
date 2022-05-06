import * as swcHelpers from "@swc/helpers";
var MyTestClass = function() {
    "use strict";
    function MyTestClass() {
        swcHelpers.classCallCheck(this, MyTestClass), this.someFunc = function() {}, this.canary, this.canary = 3;
    }
    return MyTestClass.prototype.memberFunc = function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    }, MyTestClass.staticFn = function() {
        var t, p, t = (arguments.length > 0 && void 0 !== arguments[0] && arguments[0], MyTestClass);
        t.staticCanary;
        var p = MyTestClass;
        p.staticCanary;
    }, swcHelpers.createClass(MyTestClass, [
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
                var p, p = MyTestClass;
                return p.staticCanary, this;
            },
            set: function(v) {
                var p, p = MyTestClass;
                p.staticCanary;
            }
        }
    ]), MyTestClass;
}(), MyGenericTestClass = function() {
    "use strict";
    function MyGenericTestClass() {
        swcHelpers.classCallCheck(this, MyGenericTestClass), this.someFunc = function() {}, this.canary, this.canary = 3;
    }
    return MyGenericTestClass.prototype.memberFunc = function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    }, MyGenericTestClass.staticFn = function() {
        var t, p, t = (arguments.length > 0 && void 0 !== arguments[0] && arguments[0], MyGenericTestClass);
        t.staticCanary;
        var p = MyGenericTestClass;
        p.staticCanary;
    }, swcHelpers.createClass(MyGenericTestClass, [
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
                var p, p = MyGenericTestClass;
                return p.staticCanary, this;
            },
            set: function(v) {
                var p, p = MyGenericTestClass;
                p.staticCanary;
            }
        }
    ]), MyGenericTestClass;
}();
this.spaaaaace = 4;
