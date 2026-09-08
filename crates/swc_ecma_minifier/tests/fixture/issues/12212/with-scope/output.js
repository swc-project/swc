function f(...rest) {
    with ({})return 1;
}
console.log(f(1));
