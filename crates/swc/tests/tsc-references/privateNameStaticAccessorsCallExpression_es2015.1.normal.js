import * as swcHelpers from "@swc/helpers";
// @target: es2015
class A {
    static test() {
        swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc).call(A);
        const func = swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc);
        func();
        new (swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2).call(A, 0, ...arr, 3);
        const b = new (swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2))(0, ...arr, 3);
        const str = swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2).bind(A)`head${1}middle${2}tail`;
        swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)`test${1}and${2}`;
    }
    static getClass() {
        return A;
    }
}
var _fieldFunc = {
    get: get_fieldFunc,
    set: void 0
};
var _fieldFunc2 = {
    get: get_fieldFunc2,
    set: void 0
};
var _x = {
    writable: true,
    value: 1
};
function get_fieldFunc() {
    return function() {
        swcHelpers.classStaticPrivateFieldSpecSet(A, A, _x, 10);
    };
}
function get_fieldFunc2() {
    return function(a, ...b) {};
}
