import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var c, RoyalGuard = function() {
    "use strict";
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
    "use strict";
    _inherits(LeadGuard, RoyalGuard);
    var _super = _create_super(LeadGuard);
    function LeadGuard() {
        return _class_call_check(this, LeadGuard), _super.apply(this, arguments);
    }
    return LeadGuard.prototype.lead = function() {}, LeadGuard;
}(RoyalGuard), FollowerGuard = function(RoyalGuard) {
    "use strict";
    _inherits(FollowerGuard, RoyalGuard);
    var _super = _create_super(FollowerGuard);
    function FollowerGuard() {
        return _class_call_check(this, FollowerGuard), _super.apply(this, arguments);
    }
    return FollowerGuard.prototype.follow = function() {}, FollowerGuard;
}(RoyalGuard), a = new FollowerGuard(), b = new LeadGuard();
function invalidGuard(c) {
    return !1;
}
b.isFollower = b.isLeader, b.isLeader = b.isFollower, a.isFollower = a.isLeader, a.isLeader = a.isFollower, ({
    invalidGuard: invalidGuard
}).invalidGuard(c), (0, a.isFollower)() ? a.follow() : a.lead();
