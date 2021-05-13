// @strict: true

let e1: intrinsic;
let e2: { intrinsic: intrinsic };
type TE1 = (intrinsic);
type TE2<intrinsic> = intrinsic;
type TE3<T extends intrinsic> = T;
type TE4<intrinsic extends intrinsic> = intrinsic;
type TE5<intrinsic extends intrinsic> = (intrinsic);

function f1() {
    let intrinsic: intrinsic.intrinsic;
}

function f2(intrinsic: string) {
    return intrinsic;
}

function f3() {
    type intrinsic = string;
    let s1: intrinsic = 'ok';
}
