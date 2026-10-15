const A = B;
var AliasCycle = function(AliasCycle) {
    AliasCycle[AliasCycle["X"] = A] = "X";
    return AliasCycle;
}(AliasCycle || {});
const x = y;
const y = x;
var ConstCycle = function(ConstCycle) {
    ConstCycle[ConstCycle["X"] = x] = "X";
    ConstCycle[ConstCycle["Y"] = void 0] = "Y";
    return ConstCycle;
}(ConstCycle || {});
var MemberCycle = function(MemberCycle) {
    MemberCycle[MemberCycle["X"] = MemberCycle.Y] = "X";
    MemberCycle[MemberCycle["Y"] = MemberCycle.X] = "Y";
    return MemberCycle;
}(MemberCycle || {});
(function(N) {
    N.X = N.Y;
    N.Y = N.X;
})(N || (N = {}));
var NamespaceCycle = function(NamespaceCycle) {
    NamespaceCycle[NamespaceCycle["X"] = N.X] = "X";
    return NamespaceCycle;
}(NamespaceCycle || {});
var N;
