import * as swcHelpers from "@swc/helpers";
// @target: esnext
// @useDefineForClassFields: false
class K {
    m() {}
    get g() {
        return 0;
    }
    constructor(){
        this.p = 12;
    }
}
let k = new K();
let sk = swcHelpers.objectSpread({}, k);
let ssk = swcHelpers.objectSpread({}, k, k);
sk.p;
sk.m(); // error
sk.g; // error
ssk.p;
ssk.m(); // error
ssk.g; // error
let i = {
    p: 12,
    m () {},
    get g () {
        return 0;
    }
};
let si = swcHelpers.objectSpread({}, i);
let ssi = swcHelpers.objectSpread({}, i, i);
si.p;
si.m(); // ok
si.g; // ok
ssi.p;
ssi.m(); // ok
ssi.g; // ok
let o = {
    p: 12,
    m () {},
    get g () {
        return 0;
    }
};
let so = swcHelpers.objectSpread({}, o);
let sso = swcHelpers.objectSpread({}, o, o);
so.p;
so.m(); // ok
so.g; // ok
sso.p;
sso.m(); // ok
sso.g; // ok
