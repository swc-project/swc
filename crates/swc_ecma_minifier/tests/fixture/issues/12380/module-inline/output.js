class Counter {
    static total = 0;
    id = ++Counter.total;
    read = (function(cb) {
        return ()=>cb();
    })(()=>this.id);
}
const counters = [
    new Counter(),
    new Counter(),
    new Counter()
];
console.log(counters.map((c)=>c.read()).join(","));
export { };
