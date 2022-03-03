var _tmp;
function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
class C extends B {
    constructor(...args){
        super(...args), this.x = 1, this.y = this.x, this.z = super.f();
    }
}
C.x = void 0, C.y1 = C.x, C.y2 = C.x(), C.y3 = null == C ? void 0 : C.x(), C.y4 = C.x(), C.y5 = null == C ? void 0 : C.x(), C.z1 = super.a, C.z2 = super.a, C.z3 = super.f(), C.z4 = super.f(), C.z5 = super.a = 0, C.z6 = super.a += 1, C.z7 = void (super.a = 0), C.z8 = [super.a] = [
    0
], C.z9 = [super.a = 0] = [
    0
], C.z10 = [...super.a] = [
    0
], C.z11 = { x: super.a  } = {
    x: 0
}, C.z12 = { x: super.a = 0  } = {
    x: 0
}, _tmp = {
    x: 0
}, super.a = _extends({}, _tmp), C.z13 = _tmp, C.z14 = ++super.a, C.z15 = --super.a, C.z16 = ++super.a, C.z17 = super.a++, C.z18 = super.a``;
