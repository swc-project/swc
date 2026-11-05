(function () {
    let First, Second;
    (function (ns) {
        class Handle extends globalThis.View {}
        ns.Handle = Handle;
    })(First || (First = {}));
    (function (ns) {
        class Handle extends globalThis.View {}
        ns.Handle = Handle;
    })(Second || (Second = {}));
    globalThis.tools = [First, Second];
})();
