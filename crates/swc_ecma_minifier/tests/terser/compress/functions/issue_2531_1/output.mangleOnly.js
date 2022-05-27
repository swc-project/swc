function a() {
    function a(a) {
        function b() {
            return a;
        }
        return function() {
            return b();
        };
    }
    return a("Hello");
}
console.log("Greeting:", a()());
