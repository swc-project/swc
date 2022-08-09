var p = {
    propa: 1,
    get propb () {
        return 2;
    },
    propc: 3,
    get propd () {
        return 4;
    }
};
var r = {
    propa: 5,
    get propb () {
        return 6;
    },
    propc: 7,
    get propd () {
        return 8;
    }
};
var o = {};
Object.defineProperty(o, "propa", {
    value: 9
});
Object.defineProperty(o, "propc", {
    value: 10
});
console.log(p.propa, p.propb, p.propc, p["propc"], p.propd, p["propd"]);
console.log(r["propa"], r["propb"], r.propc, r["propc"], r.propd, r["propd"]);
console.log(o.propa, o["propc"]);
