import * as swcHelpers from "@swc/helpers";
// @module: commonjs
// @target: es3
// @lib: es6
// @filename: test.ts
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = swcHelpers.asyncToGenerator(function*() {
        const req = yield import('./test') // ONE
        ;
    });
    return _fn.apply(this, arguments);
}
export class cl1 {
    m() {
        return swcHelpers.asyncToGenerator(function*() {
            const req = yield import('./test') // TWO
            ;
        })();
    }
}
export const obj = {
    m: swcHelpers.asyncToGenerator(function*() {
        const req = yield import('./test') // THREE
        ;
    })
};
export class cl2 {
    constructor(){
        this.p = {
            m: swcHelpers.asyncToGenerator(function*() {
                const req = yield import('./test') // FOUR
                ;
            })
        };
    }
}
export const l = function() {
    var _ref = swcHelpers.asyncToGenerator(function*() {
        const req = yield import('./test') // FIVE
        ;
    });
    return function l() {
        return _ref.apply(this, arguments);
    };
}();
