function Context(input) {
    if (!(this instanceof Context)) return new Context(input);
    this.state = this.construct(input);
}
module.exports = function(timeout) {
    this.timeout = timeout;
}, module.exports = function(handle) {
    this.handle = handle;
}, Context.prototype = {
    construct: (input, handle = ()=>void 0)=>input
}, module.exports = Context;
