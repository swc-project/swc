//// [ns.ts]
var ExpandoMerge, ExpandoMerge1, p3, p4, p5, p6, p7, p8, p9, ExpandoMerge2, p2;
ExpandoMerge1 = ExpandoMerge || (ExpandoMerge = {}), p3 = 333, Object.defineProperty(ExpandoMerge1, "p3", {
    enumerable: !0,
    get: function() {
        return p3;
    },
    set: function(v) {
        p3 = v;
    }
}), p4 = 4, Object.defineProperty(ExpandoMerge1, "p4", {
    enumerable: !0,
    get: function() {
        return p4;
    },
    set: function(v) {
        p4 = v;
    }
}), p5 = 5, Object.defineProperty(ExpandoMerge1, "p5", {
    enumerable: !0,
    get: function() {
        return p5;
    },
    set: function(v) {
        p5 = v;
    }
}), p6 = 6, Object.defineProperty(ExpandoMerge1, "p6", {
    enumerable: !0,
    get: function() {
        return p6;
    },
    set: function(v) {
        p6 = v;
    }
}), p7 = 7, Object.defineProperty(ExpandoMerge1, "p7", {
    enumerable: !0,
    get: function() {
        return p7;
    },
    set: function(v) {
        p7 = v;
    }
}), p8 = 6, Object.defineProperty(ExpandoMerge1, "p8", {
    enumerable: !0,
    get: function() {
        return p8;
    },
    set: function(v) {
        p8 = v;
    }
}), p9 = 7, Object.defineProperty(ExpandoMerge1, "p9", {
    enumerable: !0,
    get: function() {
        return p9;
    },
    set: function(v) {
        p9 = v;
    }
}), ExpandoMerge2 = ExpandoMerge || (ExpandoMerge = {}), p2 = 222, Object.defineProperty(ExpandoMerge2, "p2", {
    enumerable: !0,
    get: function() {
        return p2;
    },
    set: function(v) {
        p2 = v;
    }
});
//// [expando.ts]
function ExpandoMerge(n) {
    return n;
}
ExpandoMerge.p1 = 111, ExpandoMerge.m = function(n) {
    return n + 1;
}, ExpandoMerge.p4 = 44444, ExpandoMerge.p5 = 555555, ExpandoMerge.p6 = 66666, ExpandoMerge.p7 = 777777, ExpandoMerge.p8 = !1, ExpandoMerge.p9 = !1, ExpandoMerge.p1, ExpandoMerge.p2, ExpandoMerge.p3, ExpandoMerge.p4, ExpandoMerge.p5, ExpandoMerge.p6, ExpandoMerge.p7, ExpandoMerge.p8, ExpandoMerge.p9, ExpandoMerge.m(12);
