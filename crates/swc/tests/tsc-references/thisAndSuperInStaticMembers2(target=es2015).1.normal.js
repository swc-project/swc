//// [thisAndSuperInStaticMembers2.ts]
import { _ as _extends } from "@swc/helpers/_/_extends";
var _ref, __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap(), __5 = new WeakMap(), __6 = new WeakMap(), __7 = new WeakMap(), __8 = new WeakMap(), __9 = new WeakMap(), __10 = new WeakMap(), __11 = new WeakMap(), __12 = new WeakMap(), __13 = new WeakMap(), __14 = new WeakMap(), __15 = new WeakMap(), __16 = new WeakMap(), __17 = new WeakMap(), __18 = new WeakMap(), __19 = new WeakMap(), __20 = new WeakMap(), __21 = new WeakMap(), __22 = new WeakMap(), __23 = new WeakMap(), __24 = new WeakMap();
var _this, _this1;
class C extends B {
    constructor(...args){
        super(...args), // these should be unaffected
        this.x = 1, this.y = this.x, this.z = super.f();
    }
}
__.set(C, {
    writable: true,
    value: C.x = undefined
});
__2.set(C, {
    writable: true,
    value: C.y1 = C.x
});
__3.set(C, {
    writable: true,
    value: C.y2 = C.x()
});
__4.set(C, {
    writable: true,
    value: C.y3 = (_this = C) === null || _this === void 0 ? void 0 : _this.x()
});
__5.set(C, {
    writable: true,
    value: C.y4 = C["x"]()
});
__6.set(C, {
    writable: true,
    value: C.y5 = (_this1 = C) === null || _this1 === void 0 ? void 0 : _this1["x"]()
});
__7.set(C, {
    writable: true,
    value: C.z1 = super.a
});
__8.set(C, {
    writable: true,
    value: C.z2 = super["a"]
});
__9.set(C, {
    writable: true,
    value: C.z3 = super.f()
});
__10.set(C, {
    writable: true,
    value: C.z4 = super["f"]()
});
__11.set(C, {
    writable: true,
    value: C.z5 = super.a = 0
});
__12.set(C, {
    writable: true,
    value: C.z6 = super.a += 1
});
__13.set(C, {
    writable: true,
    value: C.z7 = (()=>{
        super.a = 0;
    })()
});
__14.set(C, {
    writable: true,
    value: C.z8 = [super.a] = [
        0
    ]
});
__15.set(C, {
    writable: true,
    value: C.z9 = [super.a = 0] = [
        0
    ]
});
__16.set(C, {
    writable: true,
    value: C.z10 = [...super.a] = [
        0
    ]
});
__17.set(C, {
    writable: true,
    value: C.z11 = { x: super.a } = {
        x: 0
    }
});
__18.set(C, {
    writable: true,
    value: C.z12 = { x: super.a = 0 } = {
        x: 0
    }
});
__19.set(C, {
    writable: true,
    value: C.z13 = (_ref = {
        x: 0
    }, {} = _ref, super.a = _extends({}, _ref), _ref)
});
__20.set(C, {
    writable: true,
    value: C.z14 = ++super.a
});
__21.set(C, {
    writable: true,
    value: C.z15 = --super.a
});
__22.set(C, {
    writable: true,
    value: C.z16 = ++super["a"]
});
__23.set(C, {
    writable: true,
    value: C.z17 = super.a++
});
__24.set(C, {
    writable: true,
    value: C.z18 = super.a``
});
