//// [assignmentCompatWithDiscriminatedUnion.ts]
// see 'typeRelatedToDiscriminatedType' in checker.ts:
// IteratorResult
(function(Example1) {
    // S is assignable to T0 when S["done"] is true
    // S is assignable to T1 when S["done"] is false
    t = s;
})(Example1 || (Example1 = {}));
// Dropping constituents of T
(function(Example2) {
    // S is assignable to T0 when S["a"] is 0
    // S is assignable to T2 when S["a"] is 2
    t = s;
})(Example2 || (Example2 = {}));
// Unmatched discriminants
(function(Example3) {
    // S is assignable to T0 when S["a"] is 0
    // S is *not* assignable to T1 when S["b"] is 4
    // S is *not* assignable to T2 when S["a"] is 2
    t = s;
})(Example3 || (Example3 = {}));
// Unmatched non-discriminants
(function(Example4) {
    // S is assignable to T0 when S["a"] is 0
    // S is *not* assignable to T2 when S["a"] is 2 as S is missing "c"
    t = s;
})(Example4 || (Example4 = {}));
// Maximum discriminant combinations
(function(Example5) {
    // S *should* be assignable but the number of
    // combinations is too complex.
    t = s;
})(Example5 || (Example5 = {}));
// https://github.com/Microsoft/TypeScript/issues/14865
(function(GH14865) {
    var a = {
        type: "A",
        data: "whatevs"
    };
    var b1;
    a.type; // "A" | "B"
    b1.type; // "A" | "B"
    b1 = a; // should be assignable
})(GH14865 || (GH14865 = {}));
// https://github.com/Microsoft/TypeScript/issues/30170
(function(GH30170) {
    function draw(val) {}
    function drawWithColor(currentColor) {
        return draw({
            color: currentColor
        });
    }
})(GH30170 || (GH30170 = {}));
// https://github.com/Microsoft/TypeScript/issues/12052
(function(GH12052) {
    function getAxisType() {
        if (1 == 1) {
            return "categorical";
        } else {
            return "linear";
        }
    }
    var bad = {
        type: getAxisType()
    };
    var good = {
        type: undefined
    };
    good.type = getAxisType();
})(GH12052 || (GH12052 = {}));
// https://github.com/Microsoft/TypeScript/issues/18421
(function(GH18421) {
    function makeNewThing(thingType) {
        return {
            type: thingType
        };
    }
})(GH18421 || (GH18421 = {}));
// https://github.com/Microsoft/TypeScript/issues/15907
(function(GH15907) {
    function dispatchAction(action) {}
    var active = true;
    dispatchAction({
        type: active ? 'disactivate' : 'activate'
    });
})(GH15907 || (GH15907 = {}));
// https://github.com/Microsoft/TypeScript/issues/20889
(function(GH20889) {
    function foo(obj1) {
        var obj2 = {
            type: obj1.type
        };
    }
})(GH20889 || (GH20889 = {}));
// https://github.com/microsoft/TypeScript/issues/39357
(function(GH39357) {
    var a = b === "a" || b === "b" ? [
        b,
        1
    ] : [
        "c",
        ""
    ];
})(GH39357 || (GH39357 = {}));
var Example1, Example2, Example3, Example4, Example5, GH14865, GH30170, GH12052, GH18421, GH15907, GH20889, GH39357;
