const instances = [];
for (const offset of [
    0,
    3
]){
    class Counter {
        static total = offset;
        id = ++Counter.total;
        read = ((cb)=>()=>cb())(()=>this.id);
    }
    instances.push(new Counter(), new Counter(), new Counter());
}
console.log(instances.map((instance)=>instance.read()).join(","));
