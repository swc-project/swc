import * as swcHelpers from "@swc/helpers";
class A {
    test() {
        var ref;
        swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc).call(A), null === (ref = swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc)) || void 0 === ref || ref.call(A);
        let func = swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc);
        func(), new (swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc))();
        let arr = [
            1,
            2
        ];
        swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2).call(A, 0, ...arr, 3), new (swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2))(0, ...arr, 3), swcHelpers.classStaticPrivateFieldSpecGet(A, A, _fieldFunc2).bind(A)`head${1}middle${2}tail`, swcHelpers.classStaticPrivateFieldSpecGet(this.getClass(), A, _fieldFunc2).bind(A)`test${1}and${2}`;
    }
    getClass() {
        return A;
    }
    constructor(){
        this.x = 1;
    }
}
var _fieldFunc = {
    writable: !0,
    value: function() {
        this.x = 10;
    }
}, _fieldFunc2 = {
    writable: !0,
    value: function(a, ...b) {}
};
