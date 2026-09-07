function f() {
    try {
        throw 0;
    } catch (e) {
        function g() {
            return 1;
        }
        const h = ()=>2;
        return g() + h();
    } finally{}
}
console.log(f());
