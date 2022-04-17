import * as swcHelpers from "@swc/helpers";
class AA {
    test() {
        swcHelpers.classStaticPrivateMethodGet(AA, AA, method).call(AA);
        let func = swcHelpers.classStaticPrivateMethodGet(AA, AA, method);
        func(), new (swcHelpers.classStaticPrivateMethodGet(AA, AA, method))();
        let arr = [
            1,
            2
        ];
        swcHelpers.classStaticPrivateMethodGet(AA, AA, method2).call(AA, 0, ...arr, 3), new (swcHelpers.classStaticPrivateMethodGet(AA, AA, method2))(0, ...arr, 3), swcHelpers.classStaticPrivateMethodGet(AA, AA, method2).bind(AA)`head${1}middle${2}tail`, swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)`test${1}and${2}`, swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2).call(AA, 0, ...arr, 3), new (swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2))(0, ...arr, 3), swcHelpers.classStaticPrivateMethodGet(AA.getClass(), AA, method2).bind(AA)`head${1}middle${2}tail`;
    }
    static getClass() {
        return AA;
    }
}
function method() {
    this.x = 10;
}
function method2(a, ...b) {}
AA.x = 1;
