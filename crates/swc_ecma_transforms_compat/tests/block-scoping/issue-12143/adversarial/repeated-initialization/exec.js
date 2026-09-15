var reads = [];
for (var n = 0; n < 2; n++) {
    for (let i = n, read = () => eval("i");;) {
        reads.push(read);
        i = 42;
        break;
    }
}
console.log(reads.map(f => f()).join());
