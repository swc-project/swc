//// [timer.js]
/**
 * @param {number} timeout
 */ function Timer(timeout) {
    this.timeout = timeout;
}
module.exports = Timer;
//// [hook.js]
/**
 * @typedef {(arg: import("./context")) => void} HookHandler
 */ /**
 * @param {HookHandler} handle
 */ function Hook(handle) {
    this.handle = handle;
}
module.exports = Hook;
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
    if (!_instanceof(this, Context)) {
        return new Context(input);
    }
    this.state = this.construct(input);
}
Context.prototype = {
    /**
     * @param {Input} input
     * @param {HookHandler=} handle
     * @returns {State}
     */ construct: function construct(input) {
        var handle = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
            return void 0;
        };
        return input;
    }
};
module.exports = Context;
