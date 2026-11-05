function makeQueue(...items) {
    return () => items.shift();
}
const next = makeQueue(1, 2, 3);
console.log(next(), next());
