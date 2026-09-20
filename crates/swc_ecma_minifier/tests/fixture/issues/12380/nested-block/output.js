{
    class Counter {
        static total = 0;
        id = ++Counter.total;
        callback = ()=>this.id;
        read = (function(cb) {
            return ()=>cb();
        })(this.callback);
    }
    console.log([
        new Counter(),
        new Counter(),
        new Counter()
    ].map((c)=>c.read()).join(","));
}
