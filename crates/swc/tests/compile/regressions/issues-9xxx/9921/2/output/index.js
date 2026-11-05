let [x, , ] = {
    [Symbol.iterator]: function*() {
        console.log(1);
        yield 1;
        console.log(2);
    }
};
