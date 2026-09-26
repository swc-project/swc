{
    let next = 0;
    class Counter {
        read = (function() {
            var id = ++next;
            return ()=>id;
        })();
    }
    console.log([
        new Counter(),
        new Counter(),
        new Counter()
    ].map((c)=>c.read()).join(","));
}
