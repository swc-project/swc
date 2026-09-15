for (let i = 0, read = () => i, initial = (i = 2); i < 3; i++) {
    console.log(initial, i, read());
    i = 10;
    console.log(read());
}

for (let [i, read = () => i] = [0]; i < 1; i++) {
    i = 3;
    console.log(read());
}

for (let { i, read = () => ({ i }) } = { i: 0 }; i < 1; i++) {
    i = 4;
    console.log(read().i, { i }.i);
}
