//// [spreadMethods.ts]
let k = new class {
    p = 12;
    m() {}
    get g() {
        return 0;
    }
}(), sk = {
    ...k
}, ssk = {
    ...k,
    ...k
};
sk.p, sk.m(), sk.g, ssk.p, ssk.m(), ssk.g;
let i = {
    p: 12,
    m () {},
    get g () {
        return 0;
    }
}, si = {
    ...i
}, ssi = {
    ...i,
    ...i
};
si.p, si.m(), si.g, ssi.p, ssi.m(), ssi.g;
let o = {
    p: 12,
    m () {},
    get g () {
        return 0;
    }
}, so = {
    ...o
}, sso = {
    ...o,
    ...o
};
so.p, so.m(), so.g, sso.p, sso.m(), sso.g;
