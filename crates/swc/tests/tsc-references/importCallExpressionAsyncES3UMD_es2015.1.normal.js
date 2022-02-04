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
            _next(undefined);
        });
    };
}
// @module: umd
// @target: es3
// @lib: es6
// @filename: test.ts
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = _asyncToGenerator(function*() {
        const req = yield import('./test') // ONE
        ;
    });
    return _fn.apply(this, arguments);
}
export class cl1 {
    m() {
        return _asyncToGenerator(function*() {
            const req = yield import('./test') // TWO
            ;
        })();
    }
}
export const obj = {
    m: _asyncToGenerator(function*() {
        const req = yield import('./test') // THREE
        ;
    })
};
export class cl2 {
    constructor(){
        this.p = {
            m: _asyncToGenerator(function*() {
                const req = yield import('./test') // FOUR
                ;
            })
        };
    }
}
export const l = function() {
    var _ref = _asyncToGenerator(function*() {
        const req = yield import('./test') // FIVE
        ;
    });
    return function l() {
        return _ref.apply(this, arguments);
    };
}();
