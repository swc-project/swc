import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @module: commonjs
// @target: es5
// @lib: es6
// @filename: test.ts
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = _async_to_generator(function*() {
        const req = yield import('./test') // ONE
        ;
    });
    return _fn.apply(this, arguments);
}
export class cl1 {
    m() {
        return _async_to_generator(function*() {
            const req = yield import('./test') // TWO
            ;
        })();
    }
}
export const obj = {
    m: _async_to_generator(function*() {
        const req = yield import('./test') // THREE
        ;
    })
};
export class cl2 {
    constructor(){
        this.p = {
            m: _async_to_generator(function*() {
                const req = yield import('./test') // FOUR
                ;
            })
        };
    }
}
export const l = function() {
    var _ref = _async_to_generator(function*() {
        const req = yield import('./test') // FIVE
        ;
    });
    return function l() {
        return _ref.apply(this, arguments);
    };
}();
