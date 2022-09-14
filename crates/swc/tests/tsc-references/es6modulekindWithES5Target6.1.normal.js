//// [es6modulekindWithES5Target6.ts]
export function f1() {
    var d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
}
export function f2() {
    for(var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++){
        arg[_key] = arguments[_key];
    }
}
export default function f3() {
    var d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
}
