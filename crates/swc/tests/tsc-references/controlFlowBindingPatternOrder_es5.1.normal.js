// @target: esnext
// @noEmit: true
// https://github.com/microsoft/TypeScript/pull/41094#issuecomment-716044363
{
    var a = 0;
    var ref = [], tmp = ref[0], ref1 = tmp === void 0 ? [
        9,
        a
    ] : tmp, b = ref1[a = 1];
    var bb = b;
}{
    var a1 = 1;
    var ref2 = [], tmp1 = ref2[0], ref3 = tmp1 === void 0 ? [
        9,
        a1 = 0
    ] : tmp1, b1 = ref3[a1];
    var bb1 = b1;
}{
    var a2 = 0;
    var tmp2 = [
        9,
        8
    ], ref4 = tmp2 === void 0 ? [
        9,
        a2
    ] : tmp2, b2 = ref4[a2 = 1];
    var bb2 = b2;
}{
    var a3 = 1;
    var tmp3 = [
        8,
        9
    ], ref5 = tmp3 === void 0 ? [
        a3 = 0,
        9
    ] : tmp3, b3 = ref5[a3];
    var bb3 = b3;
}
