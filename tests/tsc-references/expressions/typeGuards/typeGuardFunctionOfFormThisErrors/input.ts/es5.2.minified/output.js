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
function _possibleConstructorReturn(self, call) {
    return call && ("object" === _typeof(call) || "function" == typeof call) ? call : (function(self) {
        if (void 0 === self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
    })(self);
}
function _setPrototypeOf(o, p) {
    return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        return o.__proto__ = p, o;
    }, _setPrototypeOf(o, p);
}
var c, _typeof = function(obj) {
    return obj && "undefined" != typeof Symbol && obj.constructor === Symbol ? "symbol" : typeof obj;
}, RoyalGuard = function() {
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
    function LeadGuard() {
        return _classCallCheck(this, LeadGuard), _possibleConstructorReturn(this, _getPrototypeOf(LeadGuard).apply(this, arguments));
    }
    return _inherits(LeadGuard, RoyalGuard), _createClass(LeadGuard, [
        {
            key: "lead",
            value: function() {
            }
        }
    ]), LeadGuard;
}(RoyalGuard), FollowerGuard = function(RoyalGuard) {
    "use strict";
    function FollowerGuard() {
        return _classCallCheck(this, FollowerGuard), _possibleConstructorReturn(this, _getPrototypeOf(FollowerGuard).apply(this, arguments));
    }
    return _inherits(FollowerGuard, RoyalGuard), _createClass(FollowerGuard, [
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
