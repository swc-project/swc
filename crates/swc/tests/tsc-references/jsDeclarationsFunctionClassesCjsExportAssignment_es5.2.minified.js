function Context(input) {
    var left, right;
    if (left = this, null != (right = Context) && "undefined" != typeof Symbol && right[Symbol.hasInstance] ? !right[Symbol.hasInstance](left) : !(left instanceof right)) return new Context(input);
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
