class Counter {
    static total = 0;
    id = ++Counter.total;
    #read = (function(cb) {
        return ()=>cb();
    })(()=>this.id);
    read() {
        return this.#read();
    }
}
console.log([
    new Counter(),
    new Counter(),
    new Counter()
].map((c)=>c.read()).join(","));
