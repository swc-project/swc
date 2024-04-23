//// [a.js]
/** @type {number | undefined} */ var n;
// should get any on parameter initialisers
function f() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : n, l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    // a should be any
    a = undefined;
    a = null;
    a = 1;
    a = true;
    a = {};
    a = 'ok';
    // b should be number | undefined, not any
    b = 1;
    b = undefined;
    b = 'error';
    // l should be any[]
    l.push(1);
    l.push('ok');
}
