//// [timer.js]
/**
 * @param {number} timeout
 */ module.exports = function(timeout) {
    this.timeout = timeout;
};
//// [hook.js]
/**
 * @typedef {(arg: import("./context")) => void} HookHandler
 */ /**
 * @param {HookHandler} handle
 */ module.exports = function(handle) {
    this.handle = handle;
};
//// [context.js]
/**
 * Imports
 *
 * @typedef {import("./timer")} Timer
 * @typedef {import("./hook")} Hook
 * @typedef {import("./hook").HookHandler} HookHandler
 */ /**
 * Input type definition
 *
 * @typedef {Object} Input
 * @prop {Timer} timer
 * @prop {Hook} hook
 */ /**
 * State type definition
 *
 * @typedef {Object} State
 * @prop {Timer} timer
 * @prop {Hook} hook
 */ /**
 * New `Context`
 *
 * @class
 * @param {Input} input
 */ import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
function Context(input) {
    if (!_instanceof(this, Context)) return new Context(input);
    this.state = this.construct(input);
}
Context.prototype = {
    /**
     * @param {Input} input
     * @param {HookHandler=} handle
     * @returns {State}
     */ construct: function(input) {
        return arguments.length > 1 && void 0 !== arguments[1] && arguments[1], input;
    }
}, module.exports = Context;
