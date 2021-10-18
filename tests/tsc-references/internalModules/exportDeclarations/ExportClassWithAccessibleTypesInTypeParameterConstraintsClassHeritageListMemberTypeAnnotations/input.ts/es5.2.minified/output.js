var A;
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
    var Point = function() {
        "use strict";
        _classCallCheck(this, Point);
    };
    A.Point = Point, A.Origin = {
        x: 0,
        y: 0
    };
    var Point3d = function(Point) {
        "use strict";
        function Point3d() {
            var self, call, obj;
            return _classCallCheck(this, Point3d), self = this, call = _getPrototypeOf(Point3d).apply(this, arguments), call && ("object" == ((obj = call) && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj) || "function" == typeof call) ? call : (function(self) {
                if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return self;
            })(self);
        }
        return !function(subClass, superClass) {
            if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: !0,
                    configurable: !0
                }
            }), superClass && _setPrototypeOf(subClass, superClass);
        }(Point3d, Point), Point3d;
    }(Point);
    A.Point3d = Point3d, A.Origin3d = {
        x: 0,
        y: 0,
        z: 0
    };
    var Line = function(start, end) {
        "use strict";
        _classCallCheck(this, Line), this.start = start, this.end = end;
    };
    A.Line = Line;
}(A || (A = {
}));
