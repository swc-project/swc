import * as swcHelpers from "@swc/helpers";
var MyTestClass = function() {
    "use strict";
    function MyTestClass() {
        swcHelpers.classCallCheck(this, MyTestClass), this.someFunc = function() {}, this.canary, this.canary = 3;
    }
    return swcHelpers.createClass(MyTestClass, [
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
        swcHelpers.classCallCheck(this, MyGenericTestClass), this.someFunc = function() {}, this.canary, this.canary = 3;
    }
    return swcHelpers.createClass(MyGenericTestClass, [
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
