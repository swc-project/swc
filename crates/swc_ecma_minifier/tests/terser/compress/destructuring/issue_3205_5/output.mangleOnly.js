(function() {
    function a(a) {
        var b = a, { a: c  } = b;
        console.log(c);
    }
    a({
        a: "PASS"
    });
})();
