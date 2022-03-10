import * as swcHelpers from "@swc/helpers";
var _fieldFunc = /*#__PURE__*/ new WeakMap(), _fieldFunc2 = /*#__PURE__*/ new WeakMap();
// @target: es2015
class A {
    test() {
        var _ref;
        swcHelpers.classPrivateFieldGet(this, _fieldFunc).call(this);
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
            get: get_fieldFunc,
            set: void 0
        });
        swcHelpers.classPrivateFieldInit(this, _fieldFunc2, {
            get: get_fieldFunc2,
            set: void 0
        });
        this.x = 1;
    }
}
function get_fieldFunc() {
    return function() {
        this.x = 10;
    };
}
function get_fieldFunc2() {
    return function(a, ...b) {};
}
