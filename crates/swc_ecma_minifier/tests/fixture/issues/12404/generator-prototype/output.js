// One syntactic call executes twice and must use the same generator function.
const f = function*() {
    yield 1;
}, iterators = [];
for(let i = 0; i < 2; i++)iterators.push(f());
console.log(Object.getPrototypeOf(iterators[0]) === Object.getPrototypeOf(iterators[1])), console.log(iterators[0].next().value, iterators[1].next().value);
