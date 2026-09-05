function run() {
    let x = true;
    function f(a, b) {
        return b;
    }
    return x ? f(new class {
        constructor(a = x = false){}
    }(), 1) : f(new class {
        constructor(a = x = false){}
    }(), 2);
}
console.log(run());
function runProxy() {
    let x = true;
    const proxy = new Proxy({}, {
        get () {
            x = false;
        }
    });
    function f(a, b) {
        return a[0];
    }
    return (new class {
        constructor(a = proxy.value){}
    }(), x) ? f([
        x
    ], 1) : f([
        x
    ], 2);
}
console.log(runProxy());
