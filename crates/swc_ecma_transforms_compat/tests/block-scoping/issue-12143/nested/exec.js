const initializers = [];
const bodies = [];
for (var outer = 0; outer < 3; outer++) {
    for (let i = outer, read = () => i; i < 4; i++) {
        initializers.push(read);
        bodies.push(() => i);
        i += 1;
    }
}
console.log(initializers.map(f => f()).join());
console.log(bodies.map(f => f()).join());

function run(start) {
    for (let i = start, read = () => i; i < 5; i++) {
        i += 2;
        return [i, read()];
    }
}
console.log(JSON.stringify([run(0), run(1)]));
