//// [timer.js]
module.exports = function(timeout) {
    this.timeout = timeout;
};
//// [hook.js]
module.exports = function(handle) {
    this.handle = handle;
};
//// [context.js]
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
function Context(input) {
    if (!_instanceof(this, Context)) return new Context(input);
    this.state = this.construct(input);
}
Context.prototype = {
    construct: function(input) {
        return arguments.length > 1 && void 0 !== arguments[1] && arguments[1], input;
    }
}, module.exports = Context;
