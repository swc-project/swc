//// [typeGuardFunctionOfFormThisErrors.ts]
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
var b = new LeadGuard();
// Mismatched guards shouldn't be assignable
b.isFollower = b.isLeader;
b.isLeader = b.isFollower;
a.isFollower = a.isLeader;
a.isLeader = a.isFollower;
function invalidGuard(c) {
    return false;
}
var c;
if (invalidGuard(c)) {
    c;
} else {
    c;
}
var holder = {
    invalidGuard: invalidGuard
};
if (holder.invalidGuard(c)) {
    c;
    holder;
} else {
    c;
    holder;
}
var detached = a.isFollower;
if (detached()) {
    a.follow();
} else {
    a.lead();
}
