//// [/a.js]
/** 
* @param {{ cause?: string }} [options] 
*/ function foo() {
    var cause = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}).cause;
    return cause;
}
