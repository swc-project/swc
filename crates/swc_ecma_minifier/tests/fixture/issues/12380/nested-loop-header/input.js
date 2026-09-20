const callbacks = [];
for (let outer = 0; outer < 2; outer++) {
    let i = 0;
    for (; i < 3 && callbacks.push(((value) => () => value)(++i)); ) {}
    i = 0;
    while (i < 3 && callbacks.push(((value) => () => value)(++i))) {}
    i = 0;
    do {} while (i < 3 && callbacks.push(((value) => () => value)(++i)));
    for (i = 0; i < 3; callbacks.push(((value) => () => value)(++i))) {}
}
console.log(callbacks.map((cb) => cb()).join(","));
