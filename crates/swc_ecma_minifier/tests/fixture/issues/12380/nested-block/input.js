function wrap(cb) {
    return () => cb();
}

{
    class Counter {
        static total = 0;
        id = ++Counter.total;
        callback = () => this.id;
        read = wrap(this.callback);
    }

    const counters = [new Counter(), new Counter(), new Counter()];
    console.log(counters.map((c) => c.read()).join(","));
}
