import * as swcHelpers from "@swc/helpers";
var _method = /*#__PURE__*/ new WeakSet(), _method2 = /*#__PURE__*/ new WeakSet();
// @target: es2015
class AA {
    test() {
        var _ref, _ref1, _ref2, _ref3;
        swcHelpers.classPrivateMethodGet(this, _method, method).call(this);
        const func = swcHelpers.classPrivateMethodGet(this, _method, method);
        func();
        new (swcHelpers.classPrivateMethodGet(this, _method, method))();
        const arr = [
            1,
            2
        ];
        swcHelpers.classPrivateMethodGet(this, _method2, method2).call(this, 0, ...arr, 3);
        const b = new (swcHelpers.classPrivateMethodGet(this, _method2, method2))(0, ...arr, 3); //Error 
        const str = swcHelpers.classPrivateMethodGet(this, _method2, method2).bind(this)`head${1}middle${2}tail`;
        swcHelpers.classPrivateMethodGet(_ref = this.getInstance(), _method2, method2).bind(_ref)`test${1}and${2}`;
        swcHelpers.classPrivateMethodGet(_ref1 = this.getInstance(), _method2, method2).call(_ref1, 0, ...arr, 3);
        const b2 = new (swcHelpers.classPrivateMethodGet(_ref2 = this.getInstance(), _method2, method2))(0, ...arr, 3); //Error 
        const str2 = swcHelpers.classPrivateMethodGet(_ref3 = this.getInstance(), _method2, method2).bind(_ref3)`head${1}middle${2}tail`;
    }
    getInstance() {
        return new AA();
    }
    constructor(){
        swcHelpers.classPrivateMethodInit(this, _method);
        swcHelpers.classPrivateMethodInit(this, _method2);
        this.x = 1;
    }
}
function method() {
    this.x = 10;
}
function method2(a, ...b) {}
