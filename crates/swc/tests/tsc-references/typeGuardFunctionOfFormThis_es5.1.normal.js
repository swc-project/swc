import * as swcHelpers from "@swc/helpers";
var RoyalGuard = // @declaration: true
/*#__PURE__*/ function() {
    "use strict";
    function RoyalGuard() {
        swcHelpers.classCallCheck(this, RoyalGuard);
    }
    var _proto = RoyalGuard.prototype;
    _proto.isLeader = function isLeader() {
        return swcHelpers._instanceof(this, LeadGuard);
    };
    _proto.isFollower = function isFollower() {
        return swcHelpers._instanceof(this, FollowerGuard);
    };
    return RoyalGuard;
}();
var LeadGuard = /*#__PURE__*/ function(RoyalGuard) {
    "use strict";
    swcHelpers.inherits(LeadGuard, RoyalGuard);
    var _super = swcHelpers.createSuper(LeadGuard);
    function LeadGuard() {
        swcHelpers.classCallCheck(this, LeadGuard);
        return _super.apply(this, arguments);
    }
    var _proto = LeadGuard.prototype;
    _proto.lead = function lead() {};
    return LeadGuard;
}(RoyalGuard);
var FollowerGuard = /*#__PURE__*/ function(RoyalGuard) {
    "use strict";
    swcHelpers.inherits(FollowerGuard, RoyalGuard);
    var _super = swcHelpers.createSuper(FollowerGuard);
    function FollowerGuard() {
        swcHelpers.classCallCheck(this, FollowerGuard);
        return _super.apply(this, arguments);
    }
    var _proto = FollowerGuard.prototype;
    _proto.follow = function follow() {};
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
    var _this = this;
    swcHelpers.classCallCheck(this, ArrowGuard);
    this.isElite = function() {
        return swcHelpers._instanceof(_this, ArrowElite);
    };
    this.isMedic = function() {
        return swcHelpers._instanceof(_this, ArrowMedic);
    };
};
var ArrowElite = /*#__PURE__*/ function(ArrowGuard) {
    "use strict";
    swcHelpers.inherits(ArrowElite, ArrowGuard);
    var _super = swcHelpers.createSuper(ArrowElite);
    function ArrowElite() {
        swcHelpers.classCallCheck(this, ArrowElite);
        return _super.apply(this, arguments);
    }
    var _proto = ArrowElite.prototype;
    _proto.defend = function defend() {};
    return ArrowElite;
}(ArrowGuard);
var ArrowMedic = /*#__PURE__*/ function(ArrowGuard) {
    "use strict";
    swcHelpers.inherits(ArrowMedic, ArrowGuard);
    var _super = swcHelpers.createSuper(ArrowMedic);
    function ArrowMedic() {
        swcHelpers.classCallCheck(this, ArrowMedic);
        return _super.apply(this, arguments);
    }
    var _proto = ArrowMedic.prototype;
    _proto.heal = function heal() {};
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
        swcHelpers.classCallCheck(this, MimicGuard);
    }
    var _proto = MimicGuard.prototype;
    _proto.isLeader = function isLeader() {
        return swcHelpers._instanceof(this, MimicLeader);
    };
    _proto.isFollower = function isFollower() {
        return swcHelpers._instanceof(this, MimicFollower);
    };
    return MimicGuard;
}();
var MimicLeader = /*#__PURE__*/ function(MimicGuard) {
    "use strict";
    swcHelpers.inherits(MimicLeader, MimicGuard);
    var _super = swcHelpers.createSuper(MimicLeader);
    function MimicLeader() {
        swcHelpers.classCallCheck(this, MimicLeader);
        return _super.apply(this, arguments);
    }
    var _proto = MimicLeader.prototype;
    _proto.lead = function lead() {};
    return MimicLeader;
}(MimicGuard);
var MimicFollower = /*#__PURE__*/ function(MimicGuard) {
    "use strict";
    swcHelpers.inherits(MimicFollower, MimicGuard);
    var _super = swcHelpers.createSuper(MimicFollower);
    function MimicFollower() {
        swcHelpers.classCallCheck(this, MimicFollower);
        return _super.apply(this, arguments);
    }
    var _proto = MimicFollower.prototype;
    _proto.follow = function follow() {};
    return MimicFollower;
}(MimicGuard);
var mimic = new MimicGuard();
a.isLeader = mimic.isLeader;
a.isFollower = mimic.isFollower;
if (mimic.isFollower()) {
    mimic.follow();
    mimic.isFollower = a.isFollower;
}
