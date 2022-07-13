// @target: esnext
// @noEmit: true
// https://github.com/microsoft/TypeScript/pull/41094#issuecomment-716044363
{
    var a = 0;
    var b;
    var ref, ref1, ref2;
    ref = [], ref1 = ref[0], ref2 = ref1 === void 0 ? [
        9,
        a
    ] : ref1, b = ref2[a = 1], ref2, ref;
    var bb = b;
}{
    var a1 = 1;
    var b1;
    var ref3, ref4, ref5;
    ref3 = [], ref4 = ref3[0], ref5 = ref4 === void 0 ? [
        9,
        a1 = 0
    ] : ref4, b1 = ref5[a1], ref5, ref3;
    var bb1 = b1;
}{
    var a2 = 0;
    var b2;
    var ref6, ref7;
    ref6 = [
        9,
        8
    ], ref7 = ref6 === void 0 ? [
        9,
        a2
    ] : ref6, b2 = ref7[a2 = 1], ref7;
    var bb2 = b2;
}{
    var a3 = 1;
    var b3;
    var ref8, ref9;
    ref8 = [
        8,
        9
    ], ref9 = ref8 === void 0 ? [
        a3 = 0,
        9
    ] : ref8, b3 = ref9[a3], ref9;
    var bb3 = b3;
}// same as above but on left of a binary expression
{
    var a4 = 0;
    var b4;
    var ref10, ref11, ref12;
    ref10 = [], ref11 = ref10[0], ref12 = ref11 === void 0 ? [
        9,
        a4
    ] : ref11, b4 = ref12[a4 = 1], ref12, ref10, f();
    var bb4 = b4;
}{
    var a5 = 1;
    var b5;
    var ref13, ref14, ref15;
    ref13 = [], ref14 = ref13[0], ref15 = ref14 === void 0 ? [
        9,
        a5 = 0
    ] : ref14, b5 = ref15[a5], ref15, ref13, f();
    var bb5 = b5;
}{
    var a6 = 0;
    var b6;
    var ref16, ref17, ref18;
    ref16 = [
        [
            9,
            8
        ]
    ], ref17 = ref16[0], ref18 = ref17 === void 0 ? [
        9,
        a6
    ] : ref17, b6 = ref18[a6 = 1], ref18, ref16, f();
    var bb6 = b6;
}{
    var a7 = 1;
    var b7;
    var ref19, ref20, ref21;
    ref19 = [
        [
            8,
            9
        ]
    ], ref20 = ref19[0], ref21 = ref20 === void 0 ? [
        a7 = 0,
        9
    ] : ref20, b7 = ref21[a7], ref21, ref19, f();
    var bb7 = b7;
}// same as above but on right of a binary expression
{
    var a8 = 0;
    var b8;
    var ref22, ref23, ref24;
    f(), ref22 = [], ref23 = ref22[0], ref24 = ref23 === void 0 ? [
        9,
        a8
    ] : ref23, b8 = ref24[a8 = 1], ref24, ref22;
    var bb8 = b8;
}{
    var a9 = 1;
    var b9;
    var ref25, ref26, ref27;
    f(), ref25 = [], ref26 = ref25[0], ref27 = ref26 === void 0 ? [
        9,
        a9 = 0
    ] : ref26, b9 = ref27[a9], ref27, ref25;
    var bb9 = b9;
}{
    var a10 = 0;
    var b10;
    var ref28, ref29, ref30;
    f(), ref28 = [
        [
            9,
            8
        ]
    ], ref29 = ref28[0], ref30 = ref29 === void 0 ? [
        9,
        a10
    ] : ref29, b10 = ref30[a10 = 1], ref30, ref28;
    var bb10 = b10;
}{
    var a11 = 1;
    var b11;
    var ref31, ref32, ref33;
    f(), ref31 = [
        [
            8,
            9
        ]
    ], ref32 = ref31[0], ref33 = ref32 === void 0 ? [
        a11 = 0,
        9
    ] : ref32, b11 = ref33[a11], ref33, ref31;
    var bb11 = b11;
}
