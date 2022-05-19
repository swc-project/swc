// @strict: true
const [] = {}; // should be error
const {} = undefined; // error correctly
(([])=>0)({}); // should be error
(({})=>0)(undefined); // should be error
function foo({}) {
    return 0;
}
function bar([]) {
    return 0;
}
const {} = 1;
const [] = {};
