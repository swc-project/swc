import * as swcHelpers from "@swc/helpers";
var MyTestClass = function() {
    "use strict";
    function MyTestClass() {
        swcHelpers.classCallCheck(this, MyTestClass), this.someFunc = function() {}, this.canary, this.canary = 3;
    }
    return MyTestClass.prototype.memberFunc = function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    }, MyTestClass.staticFn = function() {
        var p, t = (arguments.length > 0 && void 0 !== arguments[0] && arguments[0], MyTestClass);
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
        swcHelpers.classCallCheck(this, MyGenericTestClass), this.someFunc = function() {}, this.canary, this.canary = 3;
    }
    return MyGenericTestClass.prototype.memberFunc = function() {
        arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
    }, MyGenericTestClass.staticFn = function() {
        var p, t = (arguments.length > 0 && void 0 !== arguments[0] && arguments[0], MyGenericTestClass);
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
                return MyGenericTestClass.staticCanary, this;
            },
            set: function(v) {
                MyGenericTestClass.staticCanary;
            }
        }
    ]), MyGenericTestClass;
}();
this.spaaaaace = 4;
