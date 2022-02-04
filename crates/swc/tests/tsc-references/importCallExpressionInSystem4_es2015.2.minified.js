function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
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
        }, (_ref = function(fn) {
            return function() {
                var self = this, args = arguments;
                return new Promise(function(resolve, reject) {
                    var gen = fn.apply(self, args);
                    function _next(value) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                    }
                    function _throw(err) {
                        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                    }
                    _next(void 0);
                });
            };
        }(function*(err) {
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
