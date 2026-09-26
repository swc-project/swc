let keys = 0, statics = 0, instances = 0;
class Counter {
    static value = ((x)=>x + 1)(++statics);
    ["read" + ++keys] = ((x)=>x + 1)(++instances);
    method() {
        return this.read1 + 1;
    }
}
const first = new Counter(), second = new Counter();
console.log(keys, statics, instances), console.log(Counter.value, first.read1, second.read1), console.log(first.method(), second.method());
