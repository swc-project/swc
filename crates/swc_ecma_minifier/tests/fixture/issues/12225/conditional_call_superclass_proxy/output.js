function run() {
    let x = true;
    const proxy = new Proxy(function() {}, {
        get (target, key) {
            "prototype" === key && (x = false);
            return Reflect.get(target, key);
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f(class extends proxy {
    }, 1) : f(class extends proxy {
    }, 2);
}
console.log(run());
