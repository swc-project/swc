//// [assignmentCompatWithDiscriminatedUnion.ts]
// see 'typeRelatedToDiscriminatedType' in checker.ts:
// IteratorResult
var Example1, Example2, Example3, Example4, Example5, GH14865, GH30170, GH12052, GH18421, GH15907, GH20889, GH39357, b1;
Example1 || (Example1 = {}), // S is assignable to T0 when S["done"] is true
// S is assignable to T1 when S["done"] is false
t = s, Example2 || (Example2 = {}), // S is assignable to T0 when S["a"] is 0
// S is assignable to T2 when S["a"] is 2
t = s, Example3 || (Example3 = {}), // S is assignable to T0 when S["a"] is 0
// S is *not* assignable to T1 when S["b"] is 4
// S is *not* assignable to T2 when S["a"] is 2
t = s, Example4 || (Example4 = {}), // S is assignable to T0 when S["a"] is 0
// S is *not* assignable to T2 when S["a"] is 2 as S is missing "c"
t = s, Example5 || (Example5 = {}), // S *should* be assignable but the number of
// combinations is too complex.
t = s, GH14865 || (GH14865 = {}), b1.type, GH30170 || (GH30170 = {}), function(GH12052) {
    function getAxisType() {
        return "categorical";
    }
    getAxisType(), getAxisType();
}(GH12052 || (GH12052 = {})), GH18421 || (GH18421 = {}), GH15907 || (GH15907 = {}), GH20889 || (GH20889 = {}), GH39357 || (GH39357 = {}), ("a" === b || "b" === b) && b;
