import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
var _B;
// @target: ES5
// @lib: es5,es2015.promise
// @noEmitHelpers: true
// https://github.com/Microsoft/TypeScript/issues/20744
class A {
}
A.B = (_B = class B {
    static func2() {
        return new Promise((resolve)=>{
            resolve(null);
        });
    }
}, _B.C = class C {
    static func() {
        return _async_to_generator(function*() {
            yield _B.func2();
        })();
    }
}, _B);
A.B.C.func();
