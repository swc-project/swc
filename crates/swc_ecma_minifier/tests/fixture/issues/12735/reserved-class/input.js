(() => {
    const first = {}, second = {};

    (ns => {
        ns.sample = "one";
        class Handle {
            static check(value) { return value === ns.sample; }
        }
        ns.Handle = Handle;
        ns.Other = Handle;
    })(first);

    (ns => {
        ns.sample = "two";
        class Handle {
            static check(value) { return value === ns.sample; }
        }
        ns.Handle = Handle;
        ns.Other = Handle;
    })(second);

    console.log(first.Handle.check("one"), second.Handle.check("two"), first.Handle !== second.Handle, first.Other === first.Handle);
})();
