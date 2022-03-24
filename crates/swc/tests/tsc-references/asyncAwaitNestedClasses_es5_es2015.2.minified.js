var _B;
import * as swcHelpers from "@swc/helpers";
class A {
}
A.B = ((_B = class {
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
}, _B), A.B.C.func();
