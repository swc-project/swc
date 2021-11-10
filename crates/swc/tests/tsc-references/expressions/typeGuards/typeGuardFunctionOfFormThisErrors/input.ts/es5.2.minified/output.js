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
function _getPrototypeOf(o) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: !0,
            configurable: !0
        }
    }), superClass && _setPrototypeOf(subClass, superClass);
}
function _instanceof(left, right) {
    return null != right && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? right[Symbol.hasInstance](left) : left instanceof right;
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
function _createSuper(Derived) {
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
}
var c, RoyalGuard = function() {
    "use strict";
    function RoyalGuard() {
        _classCallCheck(this, RoyalGuard);
    }
    return _createClass(RoyalGuard, [
        {
            key: "isLeader",
            value: function() {
                return _instanceof(this, LeadGuard);
            }
        },
        {
            key: "isFollower",
            value: function() {
                return _instanceof(this, FollowerGuard);
            }
        }
    ]), RoyalGuard;
}(), LeadGuard = function(RoyalGuard) {
    "use strict";
    _inherits(LeadGuard, RoyalGuard);
    var _super = _createSuper(LeadGuard);
    function LeadGuard() {
        return _classCallCheck(this, LeadGuard), _super.apply(this, arguments);
    }
    return _createClass(LeadGuard, [
        {
            key: "lead",
            value: function() {
            }
        }
    ]), LeadGuard;
}(RoyalGuard), FollowerGuard = function(RoyalGuard) {
    "use strict";
    _inherits(FollowerGuard, RoyalGuard);
    var _super = _createSuper(FollowerGuard);
    function FollowerGuard() {
        return _classCallCheck(this, FollowerGuard), _super.apply(this, arguments);
    }
    return _createClass(FollowerGuard, [
        {
            key: "follow",
            value: function() {
            }
        }
    ]), FollowerGuard;
}(RoyalGuard), a = new FollowerGuard(), b = new LeadGuard();
function invalidGuard(c) {
    return !1;
}
b.isFollower = b.isLeader, b.isLeader = b.isFollower, a.isFollower = a.isLeader, a.isLeader = a.isFollower, invalidGuard(c), ({
    invalidGuard: invalidGuard
}).invalidGuard(c), (0, a.isFollower)() ? a.follow() : a.lead();
