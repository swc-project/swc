const values = [];
const closures = [];
for (let i = 0, read = () => i, increment = () => ++i; i < 3; i++) {
    values.push([i, read(), increment(), i]);
    closures.push(() => i);
    if (i === 1) continue;
    i += 1;
}
console.log(JSON.stringify(values));
console.log(closures.map(f => f()).join());

const tests = [];
for (let i = 0, read = () => i; (tests.push([i, read()]), i < 2); i++) {
    console.log(i, read());
}
console.log(JSON.stringify(tests));

outer: for (let i = 0, read = () => i; i < 3; i++) {
    if (i === 0) continue outer;
    console.log(i, read());
    break outer;
}
