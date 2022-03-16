import * as swcHelpers from "@swc/helpers";
var b, crate, RoyalGuard = function() {
    "use strict";
    function RoyalGuard() {
        swcHelpers.classCallCheck(this, RoyalGuard);
    }
    var _proto = RoyalGuard.prototype;
    return _proto.isLeader = function() {
        return swcHelpers._instanceof(this, LeadGuard);
    }, _proto.isFollower = function() {
        return swcHelpers._instanceof(this, FollowerGuard);
    }, RoyalGuard;
}(), LeadGuard = function(RoyalGuard) {
    "use strict";
    swcHelpers.inherits(LeadGuard, RoyalGuard);
    var _super = swcHelpers.createSuper(LeadGuard);
    function LeadGuard() {
        return swcHelpers.classCallCheck(this, LeadGuard), _super.apply(this, arguments);
    }
    return LeadGuard.prototype.lead = function() {}, LeadGuard;
}(RoyalGuard), FollowerGuard = function(RoyalGuard) {
    "use strict";
    swcHelpers.inherits(FollowerGuard, RoyalGuard);
    var _super = swcHelpers.createSuper(FollowerGuard);
    function FollowerGuard() {
        return swcHelpers.classCallCheck(this, FollowerGuard), _super.apply(this, arguments);
    }
    return FollowerGuard.prototype.follow = function() {}, FollowerGuard;
}(RoyalGuard), a = new FollowerGuard();
a.isLeader() ? a.lead() : a.isFollower() && a.follow(), b.isLeader() ? b.lead() : b.isFollower() && b.follow();
var holder2 = {
    a: a
};
holder2.a.isLeader(), holder2.a;
var ArrowGuard = function() {
    "use strict";
    var _this = this;
    swcHelpers.classCallCheck(this, ArrowGuard), this.isElite = function() {
        return swcHelpers._instanceof(_this, ArrowElite);
    }, this.isMedic = function() {
        return swcHelpers._instanceof(_this, ArrowMedic);
    };
}, ArrowElite = function(ArrowGuard1) {
    "use strict";
    swcHelpers.inherits(ArrowElite, ArrowGuard1);
    var _super = swcHelpers.createSuper(ArrowElite);
    function ArrowElite() {
        return swcHelpers.classCallCheck(this, ArrowElite), _super.apply(this, arguments);
    }
    return ArrowElite.prototype.defend = function() {}, ArrowElite;
}(ArrowGuard), ArrowMedic = function(ArrowGuard2) {
    "use strict";
    swcHelpers.inherits(ArrowMedic, ArrowGuard2);
    var _super = swcHelpers.createSuper(ArrowMedic);
    function ArrowMedic() {
        return swcHelpers.classCallCheck(this, ArrowMedic), _super.apply(this, arguments);
    }
    return ArrowMedic.prototype.heal = function() {}, ArrowMedic;
}(ArrowGuard), guard = new ArrowGuard();
guard.isElite() ? guard.defend() : guard.isMedic() && guard.heal(), crate.isSundries() ? crate.contents.broken = !0 : crate.isSupplies() && (crate.contents.spoiled = !0), a.isFollower = b.isFollower, a.isLeader = b.isLeader;
var MimicGuard = function() {
    "use strict";
    function MimicGuard() {
        swcHelpers.classCallCheck(this, MimicGuard);
    }
    var _proto = MimicGuard.prototype;
    return _proto.isLeader = function() {
        return swcHelpers._instanceof(this, MimicLeader);
    }, _proto.isFollower = function() {
        return swcHelpers._instanceof(this, MimicFollower);
    }, MimicGuard;
}(), MimicLeader = function(MimicGuard) {
    "use strict";
    swcHelpers.inherits(MimicLeader, MimicGuard);
    var _super = swcHelpers.createSuper(MimicLeader);
    function MimicLeader() {
        return swcHelpers.classCallCheck(this, MimicLeader), _super.apply(this, arguments);
    }
    return MimicLeader.prototype.lead = function() {}, MimicLeader;
}(MimicGuard), MimicFollower = function(MimicGuard) {
    "use strict";
    swcHelpers.inherits(MimicFollower, MimicGuard);
    var _super = swcHelpers.createSuper(MimicFollower);
    function MimicFollower() {
        return swcHelpers.classCallCheck(this, MimicFollower), _super.apply(this, arguments);
    }
    return MimicFollower.prototype.follow = function() {}, MimicFollower;
}(MimicGuard), mimic = new MimicGuard();
a.isLeader = mimic.isLeader, a.isFollower = mimic.isFollower, mimic.isFollower() && (mimic.follow(), mimic.isFollower = a.isFollower);
