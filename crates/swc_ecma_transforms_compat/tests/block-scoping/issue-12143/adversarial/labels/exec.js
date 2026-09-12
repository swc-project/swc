var reads = [], steps = [];
outer: inner: for (let i = 0, read = () => i; i < 3; i++) {
    reads.push(read);
    steps.push(i);
    if (i === 0) continue outer;
    if (i === 1) continue inner;
    break outer;
}
console.log(steps.join(), reads.map(f => f()).join());
