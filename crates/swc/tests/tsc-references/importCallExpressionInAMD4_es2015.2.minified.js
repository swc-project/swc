import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
export class B {
    print() {
        return "I am B";
    }
}
export function foo() {
    return "foo";
}
export function backup() {
    return "backup";
}
export class D {
    method() {
        var _ref;
        import("./0"), this.myModule.then((Zero)=>{
            console.log(Zero.foo());
        }, (_ref = _async_to_generator(function*(err) {
            console.log(err);
            let one = yield import("./1");
            console.log(one.backup());
        }), function(err) {
            return _ref.apply(this, arguments);
        }));
    }
    constructor(){
        this.myModule = import("./0");
    }
}
