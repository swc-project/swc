var _B;
import * as swcHelpers from "@swc/helpers";
class A {
}
(_B = class {
    static func2() {
        return new Promise((resolve)=>{
            resolve(null);
        });
    }
}).C = class {
    static func() {
        return swcHelpers.asyncToGenerator(function*() {
            yield _B.func2();
        })();
    }
}, A.B = _B, A.B.C.func();
