// A parameter named `undefined` which is read only from a function declaration
// that gets inlined into its use site.
undefined;
(function (undefined) {
    globalThis.isUndefined = isUndefined;
    function isUndefined(x) {
        return x === undefined;
    }
})();

console.log(globalThis.isUndefined(void 0), globalThis.isUndefined(1));
