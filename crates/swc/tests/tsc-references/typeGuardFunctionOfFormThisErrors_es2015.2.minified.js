class RoyalGuard {
    isLeader() {
        return this instanceof LeadGuard;
    }
    isFollower() {
        return this instanceof FollowerGuard;
    }
}
class LeadGuard extends RoyalGuard {
    lead() {}
}
class FollowerGuard extends RoyalGuard {
    follow() {}
}
let a = new FollowerGuard(), b = new LeadGuard();
function invalidGuard(c) {
    return !1;
}
b.isFollower = b.isLeader, b.isLeader = b.isFollower, a.isFollower = a.isLeader, a.isLeader = a.isFollower;
let c;
({
    invalidGuard
}).invalidGuard(c), (0, a.isFollower)() ? a.follow() : a.lead();
