//// [intersectionReduction.ts]
ab.kind; // Error
var a = x;
var r1 = f10(a1); // unknown
var r2 = f10(a2); // string
// Repro from #31663
var x1 = {
    a: 'foo',
    b: 42
};
var x2 = {
    a: 'foo',
    b: true
};
x1[k] = 'bar'; // Error
x2[k] = 'bar'; // Error
;
;
s1 = s2;
s2 = s1;
t1 = t2;
t2 = t1;
// Repro from #36736
var f1 = function(t) {
    return t;
};
var f2 = function(t) {
    return t;
};
var f3 = function(t) {
    return t;
};
var f4 = function(t) {
    return t;
};
var b = shouldBeB; // works
function inGeneric(alsoShouldBeB) {
    var b = alsoShouldBeB;
}
function bar(x1) {
    var _$ab = x1;
}
