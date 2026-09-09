let value = 1;
for (let i = 0, read = () => i; i < 1; i++) {
    i = 42;
    console.log(read());
}
