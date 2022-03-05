import * as swcHelpers from "@swc/helpers";
function Context(input) {
    if (!swcHelpers._instanceof(this, Context)) return new Context(input);
    this.state = this.construct(input);
}
module.exports = function(timeout) {
    this.timeout = timeout;
}, module.exports = function(handle) {
    this.handle = handle;
}, Context.prototype = {
    construct: function(input) {
        return arguments.length > 1 && void 0 !== arguments[1] && arguments[1], input;
    }
}, module.exports = Context;
