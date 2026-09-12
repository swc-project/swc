function run(value) {
    for (let i = value, read = () => [i, this.value, arguments[0]]; i < 2;) {
        i = 42;
        console.log(read().join());
        break;
    }
}
run.call({ value: 8 }, 1);
