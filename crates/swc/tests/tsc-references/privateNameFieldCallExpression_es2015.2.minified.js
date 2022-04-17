import * as swcHelpers from "@swc/helpers";
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
class A {
    test() {
        var ref, _ref;
        swcHelpers.classPrivateFieldGet(this, _fieldFunc).call(this), null === (ref = swcHelpers.classPrivateFieldGet(this, _fieldFunc)) || void 0 === ref || ref.call(this);
        let func = swcHelpers.classPrivateFieldGet(this, _fieldFunc);
        func(), new (swcHelpers.classPrivateFieldGet(this, _fieldFunc))();
        let arr = [
            1,
            2
        ];
        swcHelpers.classPrivateFieldGet(this, _fieldFunc2).call(this, 0, ...arr, 3), new (swcHelpers.classPrivateFieldGet(this, _fieldFunc2))(0, ...arr, 3), swcHelpers.classPrivateFieldGet(this, _fieldFunc2).bind(this)`head${1}middle${2}tail`, swcHelpers.classPrivateFieldGet(_ref = this.getInstance(), _fieldFunc2).bind(_ref)`test${1}and${2}`;
    }
    getInstance() {
        return new A();
    }
    constructor(){
        swcHelpers.classPrivateFieldInit(this, _fieldFunc, {
            writable: !0,
            value: function() {
                this.x = 10;
            }
        }), swcHelpers.classPrivateFieldInit(this, _fieldFunc2, {
            writable: !0,
            value: function(a, ...b) {}
        }), this.x = 1;
    }
}
