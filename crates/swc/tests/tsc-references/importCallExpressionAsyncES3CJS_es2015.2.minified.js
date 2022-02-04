function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
function _asyncToGenerator(fn1) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn1.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(void 0);
        });
    };
}
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    return (_fn = _asyncToGenerator(function*() {
        yield import("./test");
    })).apply(this, arguments);
}
export class cl1 {
    m() {
        return _asyncToGenerator(function*() {
            yield import("./test");
        })();
    }
}
export const obj = {
    m: _asyncToGenerator(function*() {
        yield import("./test");
    })
};
export class cl2 {
    constructor(){
        this.p = {
            m: _asyncToGenerator(function*() {
                yield import("./test");
            })
        };
    }
}
export const l = function() {
    var _ref = _asyncToGenerator(function*() {
        yield import("./test");
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
