//// [typeGuardFunctionOfFormThis.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var RoyalGuard = /*#__PURE__*/ function() {
    "use strict";
    function RoyalGuard() {
        _class_call_check(this, RoyalGuard);
    }
    var _proto = RoyalGuard.prototype;
    _proto.isLeader = function isLeader() {
        return _instanceof(this, LeadGuard);
    };
    _proto.isFollower = function isFollower() {
        return _instanceof(this, FollowerGuard);
    };
    return RoyalGuard;
}();
var LeadGuard = /*#__PURE__*/ function(RoyalGuard) {
    "use strict";
    _inherits(LeadGuard, RoyalGuard);
    function LeadGuard() {
        _class_call_check(this, LeadGuard);
        return _call_super(this, LeadGuard, arguments);
    }
    var _proto = LeadGuard.prototype;
    _proto.lead = function lead() {};
    return LeadGuard;
}(RoyalGuard);
var FollowerGuard = /*#__PURE__*/ function(RoyalGuard) {
    "use strict";
    _inherits(FollowerGuard, RoyalGuard);
    function FollowerGuard() {
        _class_call_check(this, FollowerGuard);
        return _call_super(this, FollowerGuard, arguments);
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
    _class_call_check(this, ArrowGuard);
    this.isElite = function() {
        return _instanceof(_this, ArrowElite);
    };
    this.isMedic = function() {
        return _instanceof(_this, ArrowMedic);
    };
};
var ArrowElite = /*#__PURE__*/ function(ArrowGuard) {
    "use strict";
    _inherits(ArrowElite, ArrowGuard);
    function ArrowElite() {
        _class_call_check(this, ArrowElite);
        return _call_super(this, ArrowElite, arguments);
    }
    var _proto = ArrowElite.prototype;
    _proto.defend = function defend() {};
    return ArrowElite;
}(ArrowGuard);
var ArrowMedic = /*#__PURE__*/ function(ArrowGuard) {
    "use strict";
    _inherits(ArrowMedic, ArrowGuard);
    function ArrowMedic() {
        _class_call_check(this, ArrowMedic);
        return _call_super(this, ArrowMedic, arguments);
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
        _class_call_check(this, MimicGuard);
    }
    var _proto = MimicGuard.prototype;
    _proto.isLeader = function isLeader() {
        return _instanceof(this, MimicLeader);
    };
    _proto.isFollower = function isFollower() {
        return _instanceof(this, MimicFollower);
    };
    return MimicGuard;
}();
var MimicLeader = /*#__PURE__*/ function(MimicGuard) {
    "use strict";
    _inherits(MimicLeader, MimicGuard);
    function MimicLeader() {
        _class_call_check(this, MimicLeader);
        return _call_super(this, MimicLeader, arguments);
    }
    var _proto = MimicLeader.prototype;
    _proto.lead = function lead() {};
    return MimicLeader;
}(MimicGuard);
var MimicFollower = /*#__PURE__*/ function(MimicGuard) {
    "use strict";
    _inherits(MimicFollower, MimicGuard);
    function MimicFollower() {
        _class_call_check(this, MimicFollower);
        return _call_super(this, MimicFollower, arguments);
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
