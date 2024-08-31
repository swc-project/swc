//// [typeGuardFunctionOfFormThisErrors.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var c, RoyalGuard = /*#__PURE__*/ function() {
    function RoyalGuard() {
        _class_call_check(this, RoyalGuard);
    }
    var _proto = RoyalGuard.prototype;
    return _proto.isLeader = function() {
        return _instanceof(this, LeadGuard);
    }, _proto.isFollower = function() {
        return _instanceof(this, FollowerGuard);
    }, RoyalGuard;
}(), LeadGuard = /*#__PURE__*/ function(RoyalGuard) {
    function LeadGuard() {
        return _class_call_check(this, LeadGuard), _call_super(this, LeadGuard, arguments);
    }
    return _inherits(LeadGuard, RoyalGuard), LeadGuard.prototype.lead = function() {}, LeadGuard;
}(RoyalGuard), FollowerGuard = /*#__PURE__*/ function(RoyalGuard) {
    function FollowerGuard() {
        return _class_call_check(this, FollowerGuard), _call_super(this, FollowerGuard, arguments);
    }
    return _inherits(FollowerGuard, RoyalGuard), FollowerGuard.prototype.follow = function() {}, FollowerGuard;
}(RoyalGuard), a = new FollowerGuard(), b = new LeadGuard();
b.isFollower = b.isLeader, b.isLeader = b.isFollower, a.isFollower = a.isLeader, a.isLeader = a.isFollower, ({
    invalidGuard: function(c) {
        return !1;
    }
}).invalidGuard(c), (0, a.isFollower)() ? a.follow() : a.lead();
