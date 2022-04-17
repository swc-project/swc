import * as swcHelpers from "@swc/helpers";
var _fieldFunc = new WeakMap(), _fieldFunc2 = new WeakMap();
class A {
    test() {
        var _ref;
        swcHelpers.classPrivateFieldGet(this, _fieldFunc).call(this);
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
            get: function() {
                return function() {
                    this.x = 10;
                };
            },
            set: void 0
        }), swcHelpers.classPrivateFieldInit(this, _fieldFunc2, {
            get: function() {
                return function(a, ...b) {};
            },
            set: void 0
        }), this.x = 1;
    }
}
