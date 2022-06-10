(function() {
    function a(a) {
        var { a: b  } = a;
        console.log(b);
    }
    a({
        a: "PASS"
    });
})();
