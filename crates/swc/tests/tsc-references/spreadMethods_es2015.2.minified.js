import _object_spread from "@swc/helpers/src/_object_spread.mjs";
let k = new class {
    m() {}
    get g() {
        return 0;
    }
    constructor(){
        this.p = 12;
    }
}(), sk = _object_spread({}, k), ssk = _object_spread({}, k, k);
sk.p, sk.m(), sk.g, ssk.p, ssk.m(), ssk.g;
let i = {
    p: 12,
    m () {},
    get g () {
        return 0;
    }
}, si = _object_spread({}, i), ssi = _object_spread({}, i, i);
si.p, si.m(), si.g, ssi.p, ssi.m(), ssi.g;
let o = {
    p: 12,
    m () {},
    get g () {
        return 0;
    }
}, so = _object_spread({}, o), sso = _object_spread({}, o, o);
so.p, so.m(), so.g, sso.p, sso.m(), sso.g;
