for (let i = 0, f = eval("(function () { return i; })"); i < 1;) {
    i = 42;
    console.log(f());
    break;
}
