import * as swcHelpers from "@swc/helpers";
export function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    return (_fn = swcHelpers.asyncToGenerator(function*() {
        yield import("./test");
    })).apply(this, arguments);
}
export class cl1 {
    m() {
        return swcHelpers.asyncToGenerator(function*() {
            yield import("./test");
        })();
    }
}
export const obj = {
    m: swcHelpers.asyncToGenerator(function*() {
        yield import("./test");
    })
};
export class cl2 {
    constructor(){
        this.p = {
            m: swcHelpers.asyncToGenerator(function*() {
                yield import("./test");
            })
        };
    }
}
export const l = function() {
    var _ref = swcHelpers.asyncToGenerator(function*() {
        yield import("./test");
    });
    return function() {
        return _ref.apply(this, arguments);
    };
}();
