let keys = 0;
let statics = 0;
let instances = 0;
class Counter {
    static value = ((x) => x + 1)(++statics);
    [((x) => "read" + x)(++keys)] = ((x) => x + 1)(++instances);
    method() {
        return ((x) => x + 1)(this.read1);
    }
}
const first = new Counter();
const second = new Counter();
console.log(keys, statics, instances);
console.log(Counter.value, first.read1, second.read1);
console.log(first.method(), second.method());
