import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
// @lib: es2020
// @module: es2020
// @target: es2020
// @filename: 0.ts
export class B {
    print() {
        return "I am B";
    }
}
export function foo() {
    return "foo";
}
// @filename: 1.ts
export function backup() {
    return "backup";
}
class C {
    method() {
        const loadAsync = import("./0");
        this.myModule.then((Zero)=>{
            console.log(Zero.foo());
        }, function() {
            var _ref = _async_to_generator(function*(err) {
                console.log(err);
                let one = yield import("./1");
                console.log(one.backup());
            });
            return function(err) {
                return _ref.apply(this, arguments);
            };
        }());
    }
    constructor(){
        this.myModule = import("./0");
    }
}
