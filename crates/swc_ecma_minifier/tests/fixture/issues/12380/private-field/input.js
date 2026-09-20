function wrap(cb) {
    return () => cb();
}

class Counter {
    static total = 0;
    id = ++Counter.total;
    #read = wrap(() => this.id);
    read() {
        return this.#read();
    }
}

const counters = [new Counter(), new Counter(), new Counter()];
console.log(counters.map((c) => c.read()).join(","));
