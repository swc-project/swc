var _B;
import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
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
        return _async_to_generator(function*() {
            yield _B.func2();
        })();
    }
}, _B), A.B.C.func();
