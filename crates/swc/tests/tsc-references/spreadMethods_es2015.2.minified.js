import * as swcHelpers from "@swc/helpers";
let k = new class {
    m() {}
    get g() {
        return 0;
    }
    constructor(){
        this.p = 12;
    }
}(), sk = swcHelpers.objectSpread({}, k), ssk = swcHelpers.objectSpread({}, k, k);
sk.p, sk.m(), sk.g, ssk.p, ssk.m(), ssk.g;
let i = {
    p: 12,
    m () {},
    get g () {
        return 0;
    }
}, si = swcHelpers.objectSpread({}, i), ssi = swcHelpers.objectSpread({}, i, i);
si.p, si.m(), si.g, ssi.p, ssi.m(), ssi.g;
let o = {
    p: 12,
    m () {},
    get g () {
        return 0;
    }
}, so = swcHelpers.objectSpread({}, o), sso = swcHelpers.objectSpread({}, o, o);
so.p, so.m(), so.g, sso.p, sso.m(), sso.g;
