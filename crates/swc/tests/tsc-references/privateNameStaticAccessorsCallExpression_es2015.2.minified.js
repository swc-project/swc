import * as swcHelpers from "@swc/helpers";
class A {
    static test() {
        swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc).call(A);
        let func = swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc);
        func(), new (swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc))();
        let arr = [
            1,
            2
        ];
        swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2).call(A, 0, ...arr, 3), new (swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2))(0, ...arr, 3), swcHelpers.classStaticPrivateFieldSpecGet(this, A, _fieldFunc2).bind(A)`head${1}middle${2}tail`, swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)`test${1}and${2}`;
    }
    static getClass() {
        return A;
    }
}
var _fieldFunc = {
    get: function() {
        return function() {
            swcHelpers.classStaticPrivateFieldSpecSet(A, A, _x, 10);
        };
    },
    set: void 0
}, _fieldFunc2 = {
    get: function() {
        return function(a, ...b) {};
    },
    set: void 0
}, _x = {
    writable: !0,
    value: 1
};
