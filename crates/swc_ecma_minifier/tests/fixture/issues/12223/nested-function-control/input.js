function f() {
    try {
        throw 0;
    } catch (e) {
        function g() {
            let a;
            return a = 1;
        }

        const h = () => {
            let b;
            return b = 2;
        };

        return g() + h();
    } finally {}
}

console.log(f());
