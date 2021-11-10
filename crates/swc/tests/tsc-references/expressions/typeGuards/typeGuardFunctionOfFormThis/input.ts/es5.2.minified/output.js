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
var b, crate, RoyalGuard = function() {
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
}(RoyalGuard), a = new FollowerGuard();
a.isLeader() ? a.lead() : a.isFollower() && a.follow(), b.isLeader() ? b.lead() : b.isFollower() && b.follow();
var holder2 = {
    a: a
};
holder2.a.isLeader(), holder2.a;
var ArrowGuard1 = function() {
    "use strict";
    var _this = this, _this1 = this;
    _classCallCheck(this, ArrowGuard1), this.isElite = function() {
        return _instanceof(_this, ArrowElite);
    }, this.isMedic = function() {
        return _instanceof(_this1, ArrowMedic);
    };
}, ArrowElite = function(ArrowGuard) {
    "use strict";
    _inherits(ArrowElite, ArrowGuard);
    var _super = _createSuper(ArrowElite);
    function ArrowElite() {
        return _classCallCheck(this, ArrowElite), _super.apply(this, arguments);
    }
    return _createClass(ArrowElite, [
        {
            key: "defend",
            value: function() {
            }
        }
    ]), ArrowElite;
}(ArrowGuard1), ArrowMedic = function(ArrowGuard) {
    "use strict";
    _inherits(ArrowMedic, ArrowGuard);
    var _super = _createSuper(ArrowMedic);
    function ArrowMedic() {
        return _classCallCheck(this, ArrowMedic), _super.apply(this, arguments);
    }
    return _createClass(ArrowMedic, [
        {
            key: "heal",
            value: function() {
            }
        }
    ]), ArrowMedic;
}(ArrowGuard1), guard = new ArrowGuard1();
guard.isElite() ? guard.defend() : guard.isMedic() && guard.heal(), crate.isSundries() ? crate.contents.broken = !0 : crate.isSupplies() && (crate.contents.spoiled = !0), a.isFollower = b.isFollower, a.isLeader = b.isLeader;
var MimicGuard = function() {
    "use strict";
    function MimicGuard() {
        _classCallCheck(this, MimicGuard);
    }
    return _createClass(MimicGuard, [
        {
            key: "isLeader",
            value: function() {
                return _instanceof(this, MimicLeader);
            }
        },
        {
            key: "isFollower",
            value: function() {
                return _instanceof(this, MimicFollower);
            }
        }
    ]), MimicGuard;
}(), MimicLeader = function(MimicGuard) {
    "use strict";
    _inherits(MimicLeader, MimicGuard);
    var _super = _createSuper(MimicLeader);
    function MimicLeader() {
        return _classCallCheck(this, MimicLeader), _super.apply(this, arguments);
    }
    return _createClass(MimicLeader, [
        {
            key: "lead",
            value: function() {
            }
        }
    ]), MimicLeader;
}(MimicGuard), MimicFollower = function(MimicGuard) {
    "use strict";
    _inherits(MimicFollower, MimicGuard);
    var _super = _createSuper(MimicFollower);
    function MimicFollower() {
        return _classCallCheck(this, MimicFollower), _super.apply(this, arguments);
    }
    return _createClass(MimicFollower, [
        {
            key: "follow",
            value: function() {
            }
        }
    ]), MimicFollower;
}(MimicGuard), mimic = new MimicGuard();
a.isLeader = mimic.isLeader, a.isFollower = mimic.isFollower, mimic.isFollower() && (mimic.follow(), mimic.isFollower = a.isFollower);
