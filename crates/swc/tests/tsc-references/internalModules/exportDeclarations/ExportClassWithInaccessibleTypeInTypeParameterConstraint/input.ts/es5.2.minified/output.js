var A1;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
!function(A) {
    var Point1 = function() {
        "use strict";
        _classCallCheck(this, Point1);
    };
    A.Origin = {
        x: 0,
        y: 0
    };
    var Point3d = function(Point) {
        "use strict";
        !function(subClass, superClass) {
            if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: !0,
                    configurable: !0
                }
            }), superClass && _setPrototypeOf(subClass, superClass);
        }(Point3d, Point);
        var _super = function(Derived) {
            var hasNativeReflectConstruct = function() {
                if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                if (Reflect.construct.sham) return !1;
                if ("function" == typeof Proxy) return !0;
                try {
                    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
                    })), !0;
                } catch (e) {
                    return !1;
                }
            }();
            return function() {
                var obj, self, call, result, Super = _getPrototypeOf(Derived);
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else result = Super.apply(this, arguments);
                return self = this, (call = result) && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
                    if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return self;
                })(self);
            };
        }(Point3d);
        function Point3d() {
            return _classCallCheck(this, Point3d), _super.apply(this, arguments);
        }
        return Point3d;
    }(Point1);
    A.Point3d = Point3d, A.Origin3d = {
        x: 0,
        y: 0,
        z: 0
    };
    var Line = function() {
        "use strict";
        var Constructor;
        function Line(start, end) {
            _classCallCheck(this, Line), this.start = start, this.end = end;
        }
        return (function(target, props) {
            for(var i = 0; i < props.length; i++){
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
            }
        })(Constructor = Line, [
            {
                key: "fromorigin2d",
                value: function(p) {
                    return null;
                }
            }
        ]), Line;
    }();
    A.Line = Line;
}(A1 || (A1 = {
}));
