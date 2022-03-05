import * as swcHelpers from "@swc/helpers";
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
// @target: es2015
class A {
    test() {
        var ref;
        var _ref;
        swcHelpers.classPrivateFieldGet(this, _fieldFunc).call(this);
        (ref = swcHelpers.classPrivateFieldGet(this, _fieldFunc)) === null || ref === void 0 ? void 0 : ref.call(this);
        const func = swcHelpers.classPrivateFieldGet(this, _fieldFunc);
        func();
        new (swcHelpers.classPrivateFieldGet(this, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        swcHelpers.classPrivateFieldGet(this, _fieldFunc2).call(this, 0, ...arr, 3);
        const b = new (swcHelpers.classPrivateFieldGet(this, _fieldFunc2))(0, ...arr, 3);
        const str = swcHelpers.classPrivateFieldGet(this, _fieldFunc2).bind(this)`head${1}middle${2}tail`;
        swcHelpers.classPrivateFieldGet(_ref = this.getInstance(), _fieldFunc2).bind(_ref)`test${1}and${2}`;
    }
    getInstance() {
        return new A();
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _fieldFunc, {
            writable: true,
            value: function() {
                this.x = 10;
            }
        });
        swcHelpers.classPrivateFieldInit(this, _fieldFunc2, {
            writable: true,
            value: function(a, ...b) {}
        });
        this.x = 1;
    }
}
