//// [ns.ts]
var ExpandoMerge;
(function(ExpandoMerge) {
    var p3 = 333;
    Object.defineProperty(ExpandoMerge, "p3", {
        enumerable: true,
        get: function get() {
            return p3;
        },
        set: function set(v) {
            p3 = v;
        }
    });
    var p4 = 4;
    Object.defineProperty(ExpandoMerge, "p4", {
        enumerable: true,
        get: function get() {
            return p4;
        },
        set: function set(v) {
            p4 = v;
        }
    });
    var p5 = 5;
    Object.defineProperty(ExpandoMerge, "p5", {
        enumerable: true,
        get: function get() {
            return p5;
        },
        set: function set(v) {
            p5 = v;
        }
    });
    var p6 = 6;
    Object.defineProperty(ExpandoMerge, "p6", {
        enumerable: true,
        get: function get() {
            return p6;
        },
        set: function set(v) {
            p6 = v;
        }
    });
    var p7 = 7;
    Object.defineProperty(ExpandoMerge, "p7", {
        enumerable: true,
        get: function get() {
            return p7;
        },
        set: function set(v) {
            p7 = v;
        }
    });
    var p8 = 6;
    Object.defineProperty(ExpandoMerge, "p8", {
        enumerable: true,
        get: function get() {
            return p8;
        },
        set: function set(v) {
            p8 = v;
        }
    });
    var p9 = 7;
    Object.defineProperty(ExpandoMerge, "p9", {
        enumerable: true,
        get: function get() {
            return p9;
        },
        set: function set(v) {
            p9 = v;
        }
    });
})(ExpandoMerge || (ExpandoMerge = {}));
(function(ExpandoMerge) {
    var p2 = 222;
    Object.defineProperty(ExpandoMerge, "p2", {
        enumerable: true,
        get: function get() {
            return p2;
        },
        set: function set(v) {
            p2 = v;
        }
    });
})(ExpandoMerge || (ExpandoMerge = {}));
//// [expando.ts]
function ExpandoMerge(n) {
    return n;
}
ExpandoMerge.p1 = 111;
ExpandoMerge.m = function(n) {
    return n + 1;
};
ExpandoMerge.p4 = 44444;
ExpandoMerge.p5 = 555555;
ExpandoMerge.p6 = 66666;
ExpandoMerge.p7 = 777777;
ExpandoMerge.p8 = false; // type error
ExpandoMerge.p9 = false; // type error
var n = ExpandoMerge.p1 + ExpandoMerge.p2 + ExpandoMerge.p3 + ExpandoMerge.p4 + ExpandoMerge.p5 + ExpandoMerge.p6 + ExpandoMerge.p7 + ExpandoMerge.p8 + ExpandoMerge.p9 + ExpandoMerge.m(12) + ExpandoMerge(1001);
