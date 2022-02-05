function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
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
            _next(undefined);
        });
    };
}
// @module: amd
// @target: esnext
// @useDefineForClassFields: false
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
            var _ref = _asyncToGenerator(function*(err) {
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
export class D {
    method() {
        const loadAsync = import("./0");
        this.myModule.then((Zero)=>{
            console.log(Zero.foo());
        }, function() {
            var _ref = _asyncToGenerator(function*(err) {
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
