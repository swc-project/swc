for (let i = 0, read = () => [i, eval("i")]; i < 1;) {
    i = 42;
    console.log(...read());
    break;
}
