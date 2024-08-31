//// [typeGuardFunctionOfFormThis.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var b, crate, RoyalGuard = /*#__PURE__*/ function() {
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
}(RoyalGuard), a = new FollowerGuard();
a.isLeader() ? a.lead() : a.isFollower() && a.follow(), b.isLeader() ? b.lead() : b.isFollower() && b.follow(), a.isLeader();
var ArrowGuard = function ArrowGuard() {
    var _this = this;
    _class_call_check(this, ArrowGuard), this.isElite = function() {
        return _instanceof(_this, ArrowElite);
    }, this.isMedic = function() {
        return _instanceof(_this, ArrowMedic);
    };
}, ArrowElite = /*#__PURE__*/ function(ArrowGuard) {
    function ArrowElite() {
        return _class_call_check(this, ArrowElite), _call_super(this, ArrowElite, arguments);
    }
    return _inherits(ArrowElite, ArrowGuard), ArrowElite.prototype.defend = function() {}, ArrowElite;
}(ArrowGuard), ArrowMedic = /*#__PURE__*/ function(ArrowGuard) {
    function ArrowMedic() {
        return _class_call_check(this, ArrowMedic), _call_super(this, ArrowMedic, arguments);
    }
    return _inherits(ArrowMedic, ArrowGuard), ArrowMedic.prototype.heal = function() {}, ArrowMedic;
}(ArrowGuard), guard = new ArrowGuard();
guard.isElite() ? guard.defend() : guard.isMedic() && guard.heal(), crate.isSundries() ? crate.contents.broken = !0 : crate.isSupplies() && (crate.contents.spoiled = !0), a.isFollower = b.isFollower, a.isLeader = b.isLeader;
var MimicGuard = /*#__PURE__*/ function() {
    function MimicGuard() {
        _class_call_check(this, MimicGuard);
    }
    var _proto = MimicGuard.prototype;
    return _proto.isLeader = function() {
        return _instanceof(this, MimicLeader);
    }, _proto.isFollower = function() {
        return _instanceof(this, MimicFollower);
    }, MimicGuard;
}(), MimicLeader = /*#__PURE__*/ function(MimicGuard) {
    function MimicLeader() {
        return _class_call_check(this, MimicLeader), _call_super(this, MimicLeader, arguments);
    }
    return _inherits(MimicLeader, MimicGuard), MimicLeader.prototype.lead = function() {}, MimicLeader;
}(MimicGuard), MimicFollower = /*#__PURE__*/ function(MimicGuard) {
    function MimicFollower() {
        return _class_call_check(this, MimicFollower), _call_super(this, MimicFollower, arguments);
    }
    return _inherits(MimicFollower, MimicGuard), MimicFollower.prototype.follow = function() {}, MimicFollower;
}(MimicGuard), mimic = new MimicGuard();
a.isLeader = mimic.isLeader, a.isFollower = mimic.isFollower, mimic.isFollower() && (mimic.follow(), mimic.isFollower = a.isFollower);
