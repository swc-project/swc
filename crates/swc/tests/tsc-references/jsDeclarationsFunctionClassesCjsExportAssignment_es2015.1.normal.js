// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: timer.js
/**
 * @param {number} timeout
 */ function Timer(timeout) {
    this.timeout = timeout;
}
module.exports = Timer;
// @filename: hook.js
/**
 * @param {HookHandler} handle
 */ /**
 * @typedef {(arg: import("./context")) => void} HookHandler
 */ /**
 * @param {HookHandler} handle
 */ function Hook(handle) {
    this.handle = handle;
}
module.exports = Hook;
// @filename: context.js
/**
 * New `Context`
 *
 * @class
 * @param {Input} input
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
 */ /**
 * Input type definition
 *
 * @typedef {Object} Input
 * @prop {Timer} timer
 * @prop {Hook} hook
 */ /**
 * New `Context`
 *
 * @class
 * @param {Input} input
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
 */ /**
 * Imports
 *
 * @typedef {import("./timer")} Timer
 * @typedef {import("./hook")} Hook
 * @typedef {import("./hook").HookHandler} HookHandler
 */ /**
 * New `Context`
 *
 * @class
 * @param {Input} input
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
 */ /**
 * Input type definition
 *
 * @typedef {Object} Input
 * @prop {Timer} timer
 * @prop {Hook} hook
 */ /**
 * New `Context`
 *
 * @class
 * @param {Input} input
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
 */ function Context(input) {
    if (!(this instanceof Context)) {
        return new Context(input);
    }
    this.state = this.construct(input);
}
Context.prototype = {
    /**
     * @param {Input} input
     * @param {HookHandler=} handle
     * @returns {State}
     */ construct (input, handle = ()=>void 0
    ) {
        return input;
    }
};
module.exports = Context;
