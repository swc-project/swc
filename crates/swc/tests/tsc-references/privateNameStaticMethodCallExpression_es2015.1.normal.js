import * as swcHelpers from "@swc/helpers";
// @target: es2015
class AA {
    test() {
        swcHelpers.classStaticPrivateMethodGet(AA, AA, method).call(AA);
        const func = swcHelpers.classStaticPrivateMethodGet(AA, AA, method);
        func();
        new (swcHelpers.classStaticPrivateMethodGet(AA, AA, method))();
        const arr = [
            1,
            2
        ];
        swcHelpers.classStaticPrivateMethodGet(AA, AA, method2).call(AA, 0, ...arr, 3);
        const b = new (swcHelpers.classStaticPrivateMethodGet(AA, AA, method2))(0, ...arr, 3); //Error 
        const str = swcHelpers.classStaticPrivateMethodGet(AA, AA, method2).bind(AA)`head${1}middle${2}tail`;
        swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)`test${1}and${2}`;
        swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2).call(AA, 0, ...arr, 3);
        const b2 = new (swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2))(0, ...arr, 3); //Error 
        const str2 = swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)`head${1}middle${2}tail`;
    }
    static getClass() {
        return AA;
    }
}
AA.x = 1;
function method() {
    this.x = 10;
}
function method2(a, ...b) {}
