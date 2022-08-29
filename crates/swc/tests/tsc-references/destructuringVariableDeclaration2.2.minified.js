//// [destructuringVariableDeclaration2.ts]
var ref = {
    a1: !0,
    a2: 1
};
ref.a1, ref.a2;
var ref1 = [
    1,
    2,
    {
        c3: 4,
        c5: 0
    }
], ref2 = (ref1[0], ref1[1], ref1[2]);
ref2.c3, ref2.c5, ref1.slice(4);
