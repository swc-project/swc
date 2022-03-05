import * as swcHelpers from "@swc/helpers";
var RoyalGuard = // @declaration: true
/*#__PURE__*/ function() {
    "use strict";
    function RoyalGuard() {
        swcHelpers.classCallCheck(this, RoyalGuard);
    }
    swcHelpers.createClass(RoyalGuard, [
        {
            key: "isLeader",
            value: function isLeader() {
                return swcHelpers._instanceof(this, LeadGuard);
            }
        },
        {
            key: "isFollower",
            value: function isFollower() {
                return swcHelpers._instanceof(this, FollowerGuard);
            }
        }
    ]);
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
    swcHelpers.createClass(LeadGuard, [
        {
            key: "lead",
            value: function lead() {}
        }
    ]);
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
    swcHelpers.createClass(FollowerGuard, [
        {
            key: "follow",
            value: function follow() {}
        }
    ]);
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
