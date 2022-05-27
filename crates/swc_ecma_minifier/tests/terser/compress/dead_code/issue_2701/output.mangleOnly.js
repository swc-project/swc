function a(a) {
    return (a = (function() {
        return function() {
            return a;
        };
    })());
}
console.log(typeof a()());
