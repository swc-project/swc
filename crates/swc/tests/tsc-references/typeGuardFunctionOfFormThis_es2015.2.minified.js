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
let a = new FollowerGuard();
a.isLeader() ? a.lead() : a.isFollower() && a.follow();
let b;
b.isLeader() ? b.lead() : b.isFollower() && b.follow();
var holder2 = {
    a
};
holder2.a.isLeader(), holder2.a;
class ArrowGuard {
    constructor(){
        this.isElite = ()=>this instanceof ArrowElite, this.isMedic = ()=>this instanceof ArrowMedic;
    }
}
class ArrowElite extends ArrowGuard {
    defend() {}
}
class ArrowMedic extends ArrowGuard {
    heal() {}
}
let guard = new ArrowGuard();
guard.isElite() ? guard.defend() : guard.isMedic() && guard.heal();
let crate;
crate.isSundries() ? crate.contents.broken = !0 : crate.isSupplies() && (crate.contents.spoiled = !0), a.isFollower = b.isFollower, a.isLeader = b.isLeader;
class MimicGuard {
    isLeader() {
        return this instanceof MimicLeader;
    }
    isFollower() {
        return this instanceof MimicFollower;
    }
}
class MimicLeader extends MimicGuard {
    lead() {}
}
class MimicFollower extends MimicGuard {
    follow() {}
}
let mimic = new MimicGuard();
a.isLeader = mimic.isLeader, a.isFollower = mimic.isFollower, mimic.isFollower() && (mimic.follow(), mimic.isFollower = a.isFollower);
