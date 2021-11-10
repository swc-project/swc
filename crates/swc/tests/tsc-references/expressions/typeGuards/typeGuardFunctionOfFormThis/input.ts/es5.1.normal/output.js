function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
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
function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assertThisInitialized(self);
}
function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _setPrototypeOf(o, p);
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        }));
        return true;
    } catch (e) {
        return false;
    }
}
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = _getPrototypeOf(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _getPrototypeOf(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possibleConstructorReturn(this, result);
    };
}
var RoyalGuard = // @declaration: true
/*#__PURE__*/ function() {
    "use strict";
    function RoyalGuard() {
        _classCallCheck(this, RoyalGuard);
    }
    _createClass(RoyalGuard, [
        {
            key: "isLeader",
            value: function isLeader() {
                return _instanceof(this, LeadGuard);
            }
        },
        {
            key: "isFollower",
            value: function isFollower() {
                return _instanceof(this, FollowerGuard);
            }
        }
    ]);
    return RoyalGuard;
}();
var LeadGuard = /*#__PURE__*/ function(RoyalGuard) {
    "use strict";
    _inherits(LeadGuard, RoyalGuard);
    var _super = _createSuper(LeadGuard);
    function LeadGuard() {
        _classCallCheck(this, LeadGuard);
        return _super.apply(this, arguments);
    }
    _createClass(LeadGuard, [
        {
            key: "lead",
            value: function lead() {
            }
        }
    ]);
    return LeadGuard;
}(RoyalGuard);
var FollowerGuard = /*#__PURE__*/ function(RoyalGuard) {
    "use strict";
    _inherits(FollowerGuard, RoyalGuard);
    var _super = _createSuper(FollowerGuard);
    function FollowerGuard() {
        _classCallCheck(this, FollowerGuard);
        return _super.apply(this, arguments);
    }
    _createClass(FollowerGuard, [
        {
            key: "follow",
            value: function follow() {
            }
        }
    ]);
    return FollowerGuard;
}(RoyalGuard);
var a = new FollowerGuard();
if (a.isLeader()) {
    a.lead();
} else if (a.isFollower()) {
    a.follow();
}
var b;
if (b.isLeader()) {
    b.lead();
} else if (b.isFollower()) {
    b.follow();
}
// if (((a.isLeader)())) {
//     a.lead();
// }
// else if (((a).isFollower())) {
//     a.follow();
// }
// if (((a["isLeader"])())) {
//     a.lead();
// }
// else if (((a)["isFollower"]())) {
//     a.follow();
// }
var holder2 = {
    a: a
};
if (holder2.a.isLeader()) {
    holder2.a;
} else {
    holder2.a;
}
var ArrowGuard = function ArrowGuard() {
    "use strict";
    var _this = this, _this1 = this;
    _classCallCheck(this, ArrowGuard);
    this.isElite = function() {
        return _instanceof(_this, ArrowElite);
    };
    this.isMedic = function() {
        return _instanceof(_this1, ArrowMedic);
    };
};
var ArrowElite = /*#__PURE__*/ function(ArrowGuard) {
    "use strict";
    _inherits(ArrowElite, ArrowGuard);
    var _super = _createSuper(ArrowElite);
    function ArrowElite() {
        _classCallCheck(this, ArrowElite);
        return _super.apply(this, arguments);
    }
    _createClass(ArrowElite, [
        {
            key: "defend",
            value: function defend() {
            }
        }
    ]);
    return ArrowElite;
}(ArrowGuard);
var ArrowMedic = /*#__PURE__*/ function(ArrowGuard) {
    "use strict";
    _inherits(ArrowMedic, ArrowGuard);
    var _super = _createSuper(ArrowMedic);
    function ArrowMedic() {
        _classCallCheck(this, ArrowMedic);
        return _super.apply(this, arguments);
    }
    _createClass(ArrowMedic, [
        {
            key: "heal",
            value: function heal() {
            }
        }
    ]);
    return ArrowMedic;
}(ArrowGuard);
var guard = new ArrowGuard();
if (guard.isElite()) {
    guard.defend();
} else if (guard.isMedic()) {
    guard.heal();
}
var crate;
if (crate.isSundries()) {
    crate.contents.broken = true;
} else if (crate.isSupplies()) {
    crate.contents.spoiled = true;
}
// Matching guards should be assignable
a.isFollower = b.isFollower;
a.isLeader = b.isLeader;
var MimicGuard = /*#__PURE__*/ function() {
    "use strict";
    function MimicGuard() {
        _classCallCheck(this, MimicGuard);
    }
    _createClass(MimicGuard, [
        {
            key: "isLeader",
            value: function isLeader() {
                return _instanceof(this, MimicLeader);
            }
        },
        {
            key: "isFollower",
            value: function isFollower() {
                return _instanceof(this, MimicFollower);
            }
        }
    ]);
    return MimicGuard;
}();
var MimicLeader = /*#__PURE__*/ function(MimicGuard) {
    "use strict";
    _inherits(MimicLeader, MimicGuard);
    var _super = _createSuper(MimicLeader);
    function MimicLeader() {
        _classCallCheck(this, MimicLeader);
        return _super.apply(this, arguments);
    }
    _createClass(MimicLeader, [
        {
            key: "lead",
            value: function lead() {
            }
        }
    ]);
    return MimicLeader;
}(MimicGuard);
var MimicFollower = /*#__PURE__*/ function(MimicGuard) {
    "use strict";
    _inherits(MimicFollower, MimicGuard);
    var _super = _createSuper(MimicFollower);
    function MimicFollower() {
        _classCallCheck(this, MimicFollower);
        return _super.apply(this, arguments);
    }
    _createClass(MimicFollower, [
        {
            key: "follow",
            value: function follow() {
            }
        }
    ]);
    return MimicFollower;
}(MimicGuard);
var mimic = new MimicGuard();
a.isLeader = mimic.isLeader;
a.isFollower = mimic.isFollower;
if (mimic.isFollower()) {
    mimic.follow();
    mimic.isFollower = a.isFollower;
}
