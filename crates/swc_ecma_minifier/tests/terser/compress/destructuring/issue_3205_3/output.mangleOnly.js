(function() {
    function a(a, { a: b  } = a) {
        console.log(b);
    }
    a({
        a: "PASS"
    });
})();
