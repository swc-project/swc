//// [destructuringVariableDeclaration2.ts]
var _ref = {
    a1: !0,
    a2: 1
};
_ref.a1, _ref.a2;
var _ref1 = [
    1,
    2,
    {
        c3: 4,
        c5: 0
    }
], _ref_ = (_ref1[0], _ref1[1], _ref1[2]);
_ref_.c3, _ref_.c5, _ref1.slice(4);
