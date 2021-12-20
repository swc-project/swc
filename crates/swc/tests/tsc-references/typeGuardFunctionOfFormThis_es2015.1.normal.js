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
if (a.isLeader()) {
    a.lead();
} else if (a.isFollower()) {
    a.follow();
}
let b;
if (b.isLeader()) {
    b.lead();
} else if (b.isFollower()) {
    b.follow();
}
// if (((a.isLeader)())) {
//     a.lead();
// }
// else if (((a).isFollower())) {
//     a.follow();
// }
// if (((a["isLeader"])())) {
//     a.lead();
// }
// else if (((a)["isFollower"]())) {
//     a.follow();
// }
var holder2 = {
    a
};
if (holder2.a.isLeader()) {
    holder2.a;
} else {
    holder2.a;
}
class ArrowGuard {
    constructor(){
        this.isElite = ()=>{
            return this instanceof ArrowElite;
        };
        this.isMedic = ()=>{
            return this instanceof ArrowMedic;
        };
    }
}
class ArrowElite extends ArrowGuard {
    defend() {
    }
}
class ArrowMedic extends ArrowGuard {
    heal() {
    }
}
let guard = new ArrowGuard();
if (guard.isElite()) {
    guard.defend();
} else if (guard.isMedic()) {
    guard.heal();
}
let crate;
if (crate.isSundries()) {
    crate.contents.broken = true;
} else if (crate.isSupplies()) {
    crate.contents.spoiled = true;
}
// Matching guards should be assignable
a.isFollower = b.isFollower;
a.isLeader = b.isLeader;
class MimicGuard {
    isLeader() {
        return this instanceof MimicLeader;
    }
    isFollower() {
        return this instanceof MimicFollower;
    }
}
class MimicLeader extends MimicGuard {
    lead() {
    }
}
class MimicFollower extends MimicGuard {
    follow() {
    }
}
let mimic = new MimicGuard();
a.isLeader = mimic.isLeader;
a.isFollower = mimic.isFollower;
if (mimic.isFollower()) {
    mimic.follow();
    mimic.isFollower = a.isFollower;
}
