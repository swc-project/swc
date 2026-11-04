export function example() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "click", b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, c = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
    console.log(a, b, c);
}
