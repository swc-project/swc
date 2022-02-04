var _class;
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
class A {
}
(_class = class {
    static func2() {
        return new Promise((resolve)=>{
            resolve(null);
        });
    }
}).C = class {
    static func() {
        return (function(fn) {
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
        })(function*() {
            yield _class.func2();
        })();
    }
}, A.B = _class, A.B.C.func();
