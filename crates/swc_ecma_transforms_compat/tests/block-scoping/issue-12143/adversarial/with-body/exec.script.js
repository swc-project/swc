for (let i = 1, read = () => i; i < 2;) {
    with ({ i: 3 }) {
        console.log(i);
    }
    i = 42;
    console.log(read());
    break;
}
