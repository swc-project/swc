(function() {
    function a(a) {
        return class extends a {
        };
    }
    function b(a) {
        return class extends a {
        };
    }
    console.log(new (class extends a(b(Array)) {
    })().concat([
        "PASS"
    ])[0]);
})();
