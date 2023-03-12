//// [thisAndSuperInStaticMembers2.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _object_destructuring_empty from "@swc/helpers/src/_object_destructuring_empty.mjs";
import _set from "@swc/helpers/src/_set.mjs";
import _update from "@swc/helpers/src/_update.mjs";
class C extends B {
    constructor(...args){
        super(...args);
        // these should be unaffected
        this.x = 1;
        this.y = this.x;
        this.z = super.f();
    }
}
(()=>{
    C.x = undefined;
})();
(()=>{
    C.y1 = C.x;
})();
(()=>{
    C.y2 = C.x();
})();
(()=>{
    C.y3 = C === null || C === void 0 ? void 0 : C.x();
})();
(()=>{
    C.y4 = C["x"]();
})();
(()=>{
    C.y5 = C === null || C === void 0 ? void 0 : C["x"]();
})();
(()=>{
    C.z1 = _get(_get_prototype_of(C), "a", C);
})();
(()=>{
    C.z2 = _get(_get_prototype_of(C), "a", C);
})();
(()=>{
    C.z3 = _get(_get_prototype_of(C), "f", C).call(C);
})();
(()=>{
    C.z4 = _get(_get_prototype_of(C), "f", C).call(C);
})();
(()=>{
    C.z5 = _set(_get_prototype_of(C), "a", 0, C, true);
})();
(()=>{
    C.z6 = _update(_get_prototype_of(C), "a", C, true)._ += 1;
})();
(()=>{
    C.z7 = (()=>{
        _set(_get_prototype_of(C), "a", 0, C, true);
    })();
})();
(()=>{
    C.z8 = [_update(_get_prototype_of(C), "a", C, true)._] = [
        0
    ];
})();
(()=>{
    C.z9 = [_update(_get_prototype_of(C), "a", C, true)._ = 0] = [
        0
    ];
})();
(()=>{
    C.z10 = [..._update(_get_prototype_of(C), "a", C, true)._] = [
        0
    ];
})();
(()=>{
    C.z11 = { x: _update(_get_prototype_of(C), "a", C, true)._  } = {
        x: 0
    };
})();
(()=>{
    C.z12 = { x: _update(_get_prototype_of(C), "a", C, true)._ = 0  } = {
        x: 0
    };
})();
(()=>{
    var _tmp;
    C.z13 = (_tmp = {
        x: 0
    }, _update(_get_prototype_of(C), "a", C, true)._ = _extends({}, _object_destructuring_empty(_tmp)), _tmp);
})();
(()=>{
    C.z14 = ++_update(_get_prototype_of(C), "a", C, true)._;
})();
(()=>{
    C.z15 = --_update(_get_prototype_of(C), "a", C, true)._;
})();
(()=>{
    C.z16 = ++_update(_get_prototype_of(C), "a", C, true)._;
})();
(()=>{
    C.z17 = _update(_get_prototype_of(C), "a", C, true)._++;
})();
(()=>{
    C.z18 = _get(_get_prototype_of(C), "a", C)``;
})();
