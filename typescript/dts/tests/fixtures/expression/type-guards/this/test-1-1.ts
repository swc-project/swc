// @declaration: true
class RoyalGuard {
    isLeader(): this is LeadGuard {
        return this instanceof LeadGuard;
    }

    isFollower(): this is FollowerGuard {
        return this instanceof FollowerGuard;
    }
}

class LeadGuard extends RoyalGuard {
    lead(): void {
    };
}

class FollowerGuard extends RoyalGuard {
    follow(): void {
    };
}
