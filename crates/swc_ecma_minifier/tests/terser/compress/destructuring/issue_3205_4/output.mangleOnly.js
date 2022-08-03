(function() {
    function n(n) {
        var { a: a  } = n;
        console.log(a);
    }
    n({
        a: "PASS"
    });
})();
