//// [typeGuardFunctionOfFormThisErrors.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var c, RoyalGuard = function() {
    function RoyalGuard() {
        _class_call_check(this, RoyalGuard);
    }
    var _proto = RoyalGuard.prototype;
    return _proto.isLeader = function() {
        return _instanceof(this, LeadGuard);
    }, _proto.isFollower = function() {
        return _instanceof(this, FollowerGuard);
    }, RoyalGuard;
}(), LeadGuard = function(RoyalGuard) {
    _inherits(LeadGuard, RoyalGuard);
    var _super = _create_super(LeadGuard);
    function LeadGuard() {
        return _class_call_check(this, LeadGuard), _super.apply(this, arguments);
    }
    return LeadGuard.prototype.lead = function() {}, LeadGuard;
}(RoyalGuard), FollowerGuard = function(RoyalGuard) {
    _inherits(FollowerGuard, RoyalGuard);
    var _super = _create_super(FollowerGuard);
    function FollowerGuard() {
        return _class_call_check(this, FollowerGuard), _super.apply(this, arguments);
    }
    return FollowerGuard.prototype.follow = function() {}, FollowerGuard;
}(RoyalGuard), a = new FollowerGuard(), b = new LeadGuard();
b.isFollower = b.isLeader, b.isLeader = b.isFollower, a.isFollower = a.isLeader, a.isLeader = a.isFollower, ({
    invalidGuard: function(c) {
        return !1;
    }
}).invalidGuard(c), (0, a.isFollower)() ? a.follow() : a.lead();
