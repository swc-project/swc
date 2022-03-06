import * as swcHelpers from "@swc/helpers";
var _field = new WeakMap();
// @target: es2015
class A {
    static getInstance() {
        return new A();
    }
    constructor(){
        var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10, _ref11;
        swcHelpers.classPrivateFieldInit(this, _field, {
            writable: true,
            value: 0
        });
        swcHelpers.classPrivateFieldSet(this, _field, 1);
        swcHelpers.classPrivateFieldSet(this, _field, swcHelpers.classPrivateFieldGet(this, _field) + 2);
        swcHelpers.classPrivateFieldSet(this, _field, swcHelpers.classPrivateFieldGet(this, _field) - 3);
        swcHelpers.classPrivateFieldSet(this, _field, swcHelpers.classPrivateFieldGet(this, _field) / 4);
        swcHelpers.classPrivateFieldSet(this, _field, swcHelpers.classPrivateFieldGet(this, _field) * 5);
        swcHelpers.classPrivateFieldSet(this, _field, Math.pow(swcHelpers.classPrivateFieldGet(this, _field), 6));
        swcHelpers.classPrivateFieldSet(this, _field, swcHelpers.classPrivateFieldGet(this, _field) % 7);
        swcHelpers.classPrivateFieldSet(this, _field, swcHelpers.classPrivateFieldGet(this, _field) << 8);
        swcHelpers.classPrivateFieldSet(this, _field, swcHelpers.classPrivateFieldGet(this, _field) >> 9);
        swcHelpers.classPrivateFieldSet(this, _field, swcHelpers.classPrivateFieldGet(this, _field) >>> 10);
        swcHelpers.classPrivateFieldSet(this, _field, swcHelpers.classPrivateFieldGet(this, _field) & 11);
        swcHelpers.classPrivateFieldSet(this, _field, swcHelpers.classPrivateFieldGet(this, _field) | 12);
        swcHelpers.classPrivateFieldSet(this, _field, swcHelpers.classPrivateFieldGet(this, _field) ^ 13);
        swcHelpers.classPrivateFieldSet(A.getInstance(), _field, 1);
        swcHelpers.classPrivateFieldSet(_ref = A.getInstance(), _field, swcHelpers.classPrivateFieldGet(_ref, _field) + 2);
        swcHelpers.classPrivateFieldSet(_ref1 = A.getInstance(), _field, swcHelpers.classPrivateFieldGet(_ref1, _field) - 3);
        swcHelpers.classPrivateFieldSet(_ref2 = A.getInstance(), _field, swcHelpers.classPrivateFieldGet(_ref2, _field) / 4);
        swcHelpers.classPrivateFieldSet(_ref3 = A.getInstance(), _field, swcHelpers.classPrivateFieldGet(_ref3, _field) * 5);
        swcHelpers.classPrivateFieldSet(_ref4 = A.getInstance(), _field, Math.pow(swcHelpers.classPrivateFieldGet(_ref4, _field), 6));
        swcHelpers.classPrivateFieldSet(_ref5 = A.getInstance(), _field, swcHelpers.classPrivateFieldGet(_ref5, _field) % 7);
        swcHelpers.classPrivateFieldSet(_ref6 = A.getInstance(), _field, swcHelpers.classPrivateFieldGet(_ref6, _field) << 8);
        swcHelpers.classPrivateFieldSet(_ref7 = A.getInstance(), _field, swcHelpers.classPrivateFieldGet(_ref7, _field) >> 9);
        swcHelpers.classPrivateFieldSet(_ref8 = A.getInstance(), _field, swcHelpers.classPrivateFieldGet(_ref8, _field) >>> 10);
        swcHelpers.classPrivateFieldSet(_ref9 = A.getInstance(), _field, swcHelpers.classPrivateFieldGet(_ref9, _field) & 11);
        swcHelpers.classPrivateFieldSet(_ref10 = A.getInstance(), _field, swcHelpers.classPrivateFieldGet(_ref10, _field) | 12);
        swcHelpers.classPrivateFieldSet(_ref11 = A.getInstance(), _field, swcHelpers.classPrivateFieldGet(_ref11, _field) ^ 13);
    }
}
