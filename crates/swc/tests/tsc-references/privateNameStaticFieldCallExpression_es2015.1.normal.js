import * as swcHelpers from "@swc/helpers";
// @target: es2015
class A {
    test() {
        var ref;
        swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc).call(A);
        (ref = swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc)) === null || ref === void 0 ? void 0 : ref.call(A);
        const func = swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc);
        func();
        new (swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc))();
        const arr = [
            1,
            2
        ];
        swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2).call(A, 0, ...arr, 3);
        const b = new (swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2))(0, ...arr, 3);
        const str = swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2).bind(A)`head${1}middle${2}tail`;
        swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)`test${1}and${2}`;
    }
    getClass() {
        return A;
    }
    constructor(){
        this.x = 1;
    }
}
var _fieldFunc = {
    writable: true,
    value: function() {
        this.x = 10;
    }
};
var _fieldFunc2 = {
    writable: true,
    value: function(a, ...b) {}
};
