import _object_spread from "@swc/helpers/lib/_object_spread.js";
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
let sk = _object_spread({}, k);
let ssk = _object_spread({}, k, k);
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
let si = _object_spread({}, i);
let ssi = _object_spread({}, i, i);
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
let so = _object_spread({}, o);
let sso = _object_spread({}, o, o);
so.p;
so.m(); // ok
so.g; // ok
sso.p;
sso.m(); // ok
sso.g; // ok
