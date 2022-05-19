import * as swcHelpers from "@swc/helpers";
function fn1() {
    return _fn1.apply(this, arguments);
}
function _fn1() {
    _fn1 = swcHelpers.asyncToGenerator(function*() {
        const obj1 = yield {
            key: "value"
        };
        const obj2 = yield new Promise((resolve)=>resolve({
                key: "value"
            }));
        return yield {
            key: "value"
        };
    });
    return _fn1.apply(this, arguments);
}
