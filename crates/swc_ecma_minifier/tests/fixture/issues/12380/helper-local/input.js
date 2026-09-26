{
    let next = 0;
    function wrap() {
        var id = ++next;
        return () => id;
    }

    class Counter {
        read = wrap();
    }

    const counters = [new Counter(), new Counter(), new Counter()];
    console.log(counters.map((c) => c.read()).join(","));
}
