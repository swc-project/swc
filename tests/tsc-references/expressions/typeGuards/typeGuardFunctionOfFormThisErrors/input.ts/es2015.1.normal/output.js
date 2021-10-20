// @declaration: true
class RoyalGuard {
    isLeader() {
        return this instanceof LeadGuard;
    }
    isFollower() {
        return this instanceof FollowerGuard;
    }
}
class LeadGuard extends RoyalGuard {
    lead() {
    }
}
class FollowerGuard extends RoyalGuard {
    follow() {
    }
}
let a = new FollowerGuard();
let b = new LeadGuard();
// Mismatched guards shouldn't be assignable
b.isFollower = b.isLeader;
b.isLeader = b.isFollower;
a.isFollower = a.isLeader;
a.isLeader = a.isFollower;
function invalidGuard(c) {
    return false;
}
let c;
if (invalidGuard(c)) {
    c;
} else {
    c;
}
let holder = {
    invalidGuard
};
if (holder.invalidGuard(c)) {
    c;
    holder;
} else {
    c;
    holder;
}
let detached = a.isFollower;
if (detached()) {
    a.follow();
} else {
    a.lead();
}
