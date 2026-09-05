function objectBinding() {
    let x = true;
    let proxy = new Proxy({}, {
        get() {
            x = false;
        },
    });

    function f(a, b) {
        return b;
    }

    return x
        ? f(class { static { let { a } = proxy; } }, 1)
        : f(class { static { let { a } = proxy; } }, 2);
}

function arrayBinding() {
    let x = true;
    let proxy = new Proxy([], {
        get(target, key, receiver) {
            x = false;
            return Reflect.get(target, key, receiver);
        },
    });

    function f(a, b) {
        return b;
    }

    return x
        ? f(class { static { let [a] = proxy; } }, 1)
        : f(class { static { let [a] = proxy; } }, 2);
}

console.log(objectBinding(), arrayBinding());
