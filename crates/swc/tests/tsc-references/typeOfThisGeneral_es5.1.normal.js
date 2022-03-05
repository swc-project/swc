import * as swcHelpers from "@swc/helpers";
var _this = this;
var MyTestClass = // @target: esnext
// @useDefineForClassFields: false
/*#__PURE__*/ function() {
    "use strict";
    function MyTestClass() {
        var _this1 = this;
        swcHelpers.classCallCheck(this, MyTestClass);
        this.someFunc = function() {
            //type of 'this' in member variable initializer is the class instance type
            var t = _this1;
            var t;
        };
        //type of 'this' in constructor body is the class instance type
        var p = this.canary;
        var p;
        this.canary = 3;
    }
    swcHelpers.createClass(MyTestClass, [
        {
            //type of 'this' in member function param list is the class instance type
            key: "memberFunc",
            value: function memberFunc() {
                var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
                var t;
                //type of 'this' in member function body is the class instance type
                var p = this;
                var p;
            }
        },
        {
            key: "prop",
            get: //type of 'this' in member accessor(get and set) body is the class instance type
            function get() {
                var p = this;
                var p;
                return this;
            },
            set: function set(v) {
                var p = this;
                var p;
                p = v;
                v = p;
            }
        }
    ], [
        {
            key: "staticFn",
            value: //type of 'this' in static function param list is constructor function type
            function staticFn() {
                var t1 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
                var t1;
                var t1 = MyTestClass;
                t1.staticCanary;
                //type of 'this' in static function body is constructor function type
                var p = this;
                var p;
                var p = MyTestClass;
                p.staticCanary;
            }
        },
        {
            key: "staticProp",
            get: function get() {
                //type of 'this' in static accessor body is constructor function type
                var p = this;
                var p;
                var p = MyTestClass;
                p.staticCanary;
                return this;
            },
            set: function set(v) {
                //type of 'this' in static accessor body is constructor function type
                var p = this;
                var p;
                var p = MyTestClass;
                p.staticCanary;
            }
        }
    ]);
    return MyTestClass;
}();
var MyGenericTestClass = /*#__PURE__*/ function() {
    "use strict";
    function MyGenericTestClass() {
        var _this2 = this;
        swcHelpers.classCallCheck(this, MyGenericTestClass);
        this.someFunc = function() {
            //type of 'this' in member variable initializer is the class instance type
            var t = _this2;
            var t;
        };
        //type of 'this' in constructor body is the class instance type
        var p = this.canary;
        var p;
        this.canary = 3;
    }
    swcHelpers.createClass(MyGenericTestClass, [
        {
            //type of 'this' in member function param list is the class instance type
            key: "memberFunc",
            value: function memberFunc() {
                var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
                var t;
                //type of 'this' in member function body is the class instance type
                var p = this;
                var p;
            }
        },
        {
            key: "prop",
            get: //type of 'this' in member accessor(get and set) body is the class instance type
            function get() {
                var p = this;
                var p;
                return this;
            },
            set: function set(v) {
                var p = this;
                var p;
                p = v;
                v = p;
            }
        }
    ], [
        {
            key: "staticFn",
            value: //type of 'this' in static function param list is constructor function type
            function staticFn() {
                var t2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
                var t2;
                var t2 = MyGenericTestClass;
                t2.staticCanary;
                //type of 'this' in static function body is constructor function type
                var p = this;
                var p;
                var p = MyGenericTestClass;
                p.staticCanary;
            }
        },
        {
            key: "staticProp",
            get: function get() {
                //type of 'this' in static accessor body is constructor function type
                var p = this;
                var p;
                var p = MyGenericTestClass;
                p.staticCanary;
                return this;
            },
            set: function set(v) {
                //type of 'this' in static accessor body is constructor function type
                var p = this;
                var p;
                var p = MyGenericTestClass;
                p.staticCanary;
            }
        }
    ]);
    return MyGenericTestClass;
}();
//type of 'this' in a function declaration param list is Any
function fn() {
    var s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
    var s;
    s.spaaaaaaace = 4;
    //type of 'this' in a function declaration body is Any
    var t;
    var t = this;
    this.spaaaaace = 4;
}
//type of 'this' in a function expression param list list is Any
var q1 = function q1() {
    var s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this;
    var s;
    s.spaaaaaaace = 4;
    //type of 'this' in a function expression body is Any
    var t;
    var t = this;
    this.spaaaaace = 4;
};
//type of 'this' in a fat arrow expression param list is typeof globalThis
var q2 = function() {
    var s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _this;
    var s;
    s.spaaaaaaace = 4;
    //type of 'this' in a fat arrow expression body is typeof globalThis
    var t;
    var t = _this;
    _this.spaaaaace = 4;
};
//type of 'this' in global module is GlobalThis
var t;
var t = this;
this.spaaaaace = 4;
