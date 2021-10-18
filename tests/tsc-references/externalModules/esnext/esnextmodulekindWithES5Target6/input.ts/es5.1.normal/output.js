// @target: es5
// @module: esnext
export function f1(param) {
    var d = param === void 0 ? 0 : param;
}
export function f2() {
    for(var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++){
        arg[_key] = arguments[_key];
    }
}
export default function f3(param) {
    var d = param === void 0 ? 0 : param;
};
