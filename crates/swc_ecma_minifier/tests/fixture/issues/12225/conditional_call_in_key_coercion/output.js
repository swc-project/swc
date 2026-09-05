function run() {
    let x = true;
    const key = new Proxy({}, {
        get (_, property) {
            if (property === Symbol.toPrimitive) {
                x = false;
                return ()=>"key";
            }
        }
    });
    function f(a, b) {
        return b;
    }
    return x ? f(key in {}, 1) : f(key in {}, 2);
}
console.log(run());
