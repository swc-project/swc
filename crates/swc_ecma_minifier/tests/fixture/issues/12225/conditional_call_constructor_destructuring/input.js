function run() {
    let x = 1;
    const proxy = new Proxy({ a: 0 }, {
        get(target, key, receiver) {
            x = 0;
            return Reflect.get(target, key, receiver);
        },
    });

    function f(value, branch) {
        return value[0];
    }

    return (new (class { constructor({ a }) {} })(proxy), x)
        ? f([x], 1)
        : f([x], 2);
}

console.log(run());
