//// [timer.js]
function Timer(timeout) {
    this.timeout = timeout;
}
module.exports = Timer;
//// [hook.js]
function Hook(handle) {
    this.handle = handle;
}
module.exports = Hook;
//// [context.js]
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
function Context(input) {
    if (!_instanceof(this, Context)) return new Context(input);
    this.state = this.construct(input);
}
Context.prototype = {
    construct: function(input) {
        return arguments.length > 1 && void 0 !== arguments[1] && arguments[1], input;
    }
}, module.exports = Context;
