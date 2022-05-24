import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @declaration: true
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
    var _super = _create_super(LeadGuard);
    function LeadGuard() {
        _class_call_check(this, LeadGuard);
        return _super.apply(this, arguments);
    }
    var _proto = LeadGuard.prototype;
    _proto.lead = function lead() {};
    return LeadGuard;
}(RoyalGuard);
var FollowerGuard = /*#__PURE__*/ function(RoyalGuard) {
    "use strict";
    _inherits(FollowerGuard, RoyalGuard);
    var _super = _create_super(FollowerGuard);
    function FollowerGuard() {
        _class_call_check(this, FollowerGuard);
        return _super.apply(this, arguments);
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
