(function() {
    function a() {
        var a = {
            a: "PASS"
        }, { a: b  } = a;
        console.log(b);
    }
    a();
})();
