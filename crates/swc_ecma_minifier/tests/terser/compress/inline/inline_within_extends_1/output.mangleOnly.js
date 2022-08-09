(function() {
    function n(n) {
        return class extends n {
        };
    }
    function e(n) {
        return class extends n {
        };
    }
    console.log(new (class extends n(e(Array)) {
    })().concat([
        "PASS"
    ])[0]);
})();
