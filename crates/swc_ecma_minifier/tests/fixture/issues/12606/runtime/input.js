globalThis.View = class {};
(function () {
    let First, Second;
    (function (ns) {
        class Handle extends globalThis.View {
            static self() {
                return Handle;
            }
        }
        ns.Handle = Handle;
    })(First || (First = {}));
    ((ns) => {
        class Handle extends globalThis.View {
            static self() {
                return Handle;
            }
        }
        ns.Handle = Handle;
    })(Second || (Second = {}));
    console.log(First.Handle.name, Second.Handle.name);
    console.log(First.Handle !== Second.Handle);
    console.log(First.Handle.self() === First.Handle);
    console.log(Second.Handle.self() === Second.Handle);
    console.log(new First.Handle() instanceof globalThis.View);
    console.log(new Second.Handle() instanceof globalThis.View);
})();
