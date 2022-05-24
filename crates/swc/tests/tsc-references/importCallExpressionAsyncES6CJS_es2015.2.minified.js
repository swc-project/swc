import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    return (_fn = _async_to_generator(function*() {
        yield import('./test');
    })).apply(this, arguments);
}
export class cl1 {
    m() {
        return _async_to_generator(function*() {
            yield import('./test');
        })();
    }
}
export const obj = {
    m: _async_to_generator(function*() {
        yield import('./test');
    })
};
export class cl2 {
    constructor(){
        this.p = {
            m: _async_to_generator(function*() {
                yield import('./test');
            })
        };
    }
}
export const l = function() {
    var _ref = _async_to_generator(function*() {
        yield import('./test');
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
