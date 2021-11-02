function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var _this1 = this;
var MyTestClass = // @target: esnext
/*#__PURE__*/ function() {
    "use strict";
    function MyTestClass() {
        var _this = this;
        _classCallCheck(this, MyTestClass);
        this.someFunc = function() {
            //type of 'this' in member variable initializer is the class instance type
            var t = _this;
            var t;
        };
        //type of 'this' in constructor body is the class instance type
        var p = this.canary;
        var p;
        this.canary = 3;
    }
    _createClass(MyTestClass, [
        {
            //type of 'this' in member function param list is the class instance type
            key: "memberFunc",
            value: function memberFunc(param) {
                var t = param === void 0 ? this : param;
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
            function staticFn(param) {
                var t = param === void 0 ? this : param;
                var t;
                var t = MyTestClass;
                t.staticCanary;
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
        var _this = this;
        _classCallCheck(this, MyGenericTestClass);
        this.someFunc = function() {
            //type of 'this' in member variable initializer is the class instance type
            var t = _this;
            var t;
        };
        //type of 'this' in constructor body is the class instance type
        var p = this.canary;
        var p;
        this.canary = 3;
    }
    _createClass(MyGenericTestClass, [
        {
            //type of 'this' in member function param list is the class instance type
            key: "memberFunc",
            value: function memberFunc(param) {
                var t = param === void 0 ? this : param;
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
            function staticFn(param) {
                var t = param === void 0 ? this : param;
                var t;
                var t = MyGenericTestClass;
                t.staticCanary;
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
function fn(param) {
    var s = param === void 0 ? this : param;
    var s;
    s.spaaaaaaace = 4;
    //type of 'this' in a function declaration body is Any
    var t;
    var t = this;
    this.spaaaaace = 4;
}
//type of 'this' in a function expression param list list is Any
var q1 = function q1(param) {
    var s = param === void 0 ? this : param;
    var s;
    s.spaaaaaaace = 4;
    //type of 'this' in a function expression body is Any
    var t;
    var t = this;
    this.spaaaaace = 4;
};
//type of 'this' in a fat arrow expression param list is typeof globalThis
var q2 = function(param) {
    var s = param === void 0 ? this : param;
    var s;
    s.spaaaaaaace = 4;
    //type of 'this' in a fat arrow expression body is typeof globalThis
    var t;
    var t = _this1;
    _this1.spaaaaace = 4;
};
//type of 'this' in global module is GlobalThis
var t1;
var t1 = this;
this.spaaaaace = 4;
