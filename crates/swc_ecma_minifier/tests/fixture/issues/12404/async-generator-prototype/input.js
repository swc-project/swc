// Repeated calls must share the original async generator's prototype.
const f = async function* () {
    yield 1;
};
const iterators = [];
for (let i = 0; i < 2; i++) {
    iterators.push(f());
}
console.log(Object.getPrototypeOf(iterators[0]) === Object.getPrototypeOf(iterators[1]));
Promise.all(iterators.map(iterator => iterator.next())).then(
    values => console.log(values[0].value, values[1].value),
    error => console.log(error.name),
);
