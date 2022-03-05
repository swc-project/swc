import * as swcHelpers from "@swc/helpers";
var c, RoyalGuard = function() {
    "use strict";
    function RoyalGuard() {
        swcHelpers.classCallCheck(this, RoyalGuard);
    }
    return swcHelpers.createClass(RoyalGuard, [
        {
            key: "isLeader",
            value: function() {
                return swcHelpers._instanceof(this, LeadGuard);
            }
        },
        {
            key: "isFollower",
            value: function() {
                return swcHelpers._instanceof(this, FollowerGuard);
            }
        }
    ]), RoyalGuard;
}(), LeadGuard = function(RoyalGuard) {
    "use strict";
    swcHelpers.inherits(LeadGuard, RoyalGuard);
    var _super = swcHelpers.createSuper(LeadGuard);
    function LeadGuard() {
        return swcHelpers.classCallCheck(this, LeadGuard), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(LeadGuard, [
        {
            key: "lead",
            value: function() {}
        }
    ]), LeadGuard;
}(RoyalGuard), FollowerGuard = function(RoyalGuard) {
    "use strict";
    swcHelpers.inherits(FollowerGuard, RoyalGuard);
    var _super = swcHelpers.createSuper(FollowerGuard);
    function FollowerGuard() {
        return swcHelpers.classCallCheck(this, FollowerGuard), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(FollowerGuard, [
        {
            key: "follow",
            value: function() {}
        }
    ]), FollowerGuard;
}(RoyalGuard), a = new FollowerGuard(), b = new LeadGuard();
function invalidGuard(c) {
    return !1;
}
b.isFollower = b.isLeader, b.isLeader = b.isFollower, a.isFollower = a.isLeader, a.isLeader = a.isFollower, invalidGuard(c), ({
    invalidGuard: invalidGuard
}).invalidGuard(c), (0, a.isFollower)() ? a.follow() : a.lead();
