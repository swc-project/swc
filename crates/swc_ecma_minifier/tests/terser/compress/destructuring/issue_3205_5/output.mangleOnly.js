(function() {
    function n(n) {
        var a = n, { a: o  } = a;
        console.log(o);
    }
    n({
        a: "PASS"
    });
})();
