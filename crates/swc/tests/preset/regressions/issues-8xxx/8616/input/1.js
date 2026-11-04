
var Module = (() => {
    var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
    if (typeof __filename !== 'undefined') _scriptDir ||= __filename;
    return (
        function (moduleArg = {}) {
            var Module = moduleArg;
            var readyPromiseResolve, readyPromiseReject; Module["ready"] = new Promise((resolve, reject) => { readyPromiseResolve = resolve; readyPromiseReject = reject }); "use strict";


            return moduleArg
        }
    );
})()();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = Module;
else if (typeof define === 'function' && define['amd'])
    define([], () => Module);