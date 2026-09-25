var reads = [], steps = [];
outer: for (let i = 0, initial = () => i; i < 4; i++) {
    reads.push(() => i);
    steps.push(i);
    i += 1;
    if (i === 1) continue outer;
    break outer;
}
console.log(steps.join(), reads.map(f => f()).join());

var completed = [];
for (let i = 0, initial = () => i; i < 4; i++) {
    completed.push(() => i);
    i += 1;
}
console.log(completed.map(f => f()).join());

function run() {
    for (let i = 0, initial = () => i; i < 1; i++) {
        i = () => i;
        return [i.name, i() === i, initial()];
    }
}
console.log(JSON.stringify(run()));
