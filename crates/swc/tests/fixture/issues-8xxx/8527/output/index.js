import { _ as _extends } from "@swc/helpers/_/_extends";
function foo(_param) {
    var { a: _ref = {} } = _param, {} = _ref, b = _extends({}, _ref);
    console.log(b);
}
foo({}); // should log `{}` but throws `Uncaught TypeError: Cannot destructure undefined`
