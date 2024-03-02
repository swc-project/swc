//// [typeGuardFunctionOfFormThis.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var b, crate, RoyalGuard = function() {
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
}(RoyalGuard), a = new FollowerGuard();
a.isLeader() ? a.lead() : a.isFollower() && a.follow(), b.isLeader() ? b.lead() : b.isFollower() && b.follow(), a.isLeader();
var ArrowGuard = function ArrowGuard() {
    var _this = this;
    _class_call_check(this, ArrowGuard), this.isElite = function() {
        return _instanceof(_this, ArrowElite);
    }, this.isMedic = function() {
        return _instanceof(_this, ArrowMedic);
    };
}, ArrowElite = function(ArrowGuard) {
    _inherits(ArrowElite, ArrowGuard);
    var _super = _create_super(ArrowElite);
    function ArrowElite() {
        return _class_call_check(this, ArrowElite), _super.apply(this, arguments);
    }
    return ArrowElite.prototype.defend = function() {}, ArrowElite;
}(ArrowGuard), ArrowMedic = function(ArrowGuard) {
    _inherits(ArrowMedic, ArrowGuard);
    var _super = _create_super(ArrowMedic);
    function ArrowMedic() {
        return _class_call_check(this, ArrowMedic), _super.apply(this, arguments);
    }
    return ArrowMedic.prototype.heal = function() {}, ArrowMedic;
}(ArrowGuard), guard = new ArrowGuard();
guard.isElite() ? guard.defend() : guard.isMedic() && guard.heal(), crate.isSundries() ? crate.contents.broken = !0 : crate.isSupplies() && (crate.contents.spoiled = !0), a.isFollower = b.isFollower, a.isLeader = b.isLeader;
var MimicGuard = function() {
    function MimicGuard() {
        _class_call_check(this, MimicGuard);
    }
    var _proto = MimicGuard.prototype;
    return _proto.isLeader = function() {
        return _instanceof(this, MimicLeader);
    }, _proto.isFollower = function() {
        return _instanceof(this, MimicFollower);
    }, MimicGuard;
}(), MimicLeader = function(MimicGuard) {
    _inherits(MimicLeader, MimicGuard);
    var _super = _create_super(MimicLeader);
    function MimicLeader() {
        return _class_call_check(this, MimicLeader), _super.apply(this, arguments);
    }
    return MimicLeader.prototype.lead = function() {}, MimicLeader;
}(MimicGuard), MimicFollower = function(MimicGuard) {
    _inherits(MimicFollower, MimicGuard);
    var _super = _create_super(MimicFollower);
    function MimicFollower() {
        return _class_call_check(this, MimicFollower), _super.apply(this, arguments);
    }
    return MimicFollower.prototype.follow = function() {}, MimicFollower;
}(MimicGuard), mimic = new MimicGuard();
a.isLeader = mimic.isLeader, a.isFollower = mimic.isFollower, mimic.isFollower() && (mimic.follow(), mimic.isFollower = a.isFollower);
