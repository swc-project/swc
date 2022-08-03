(function() {
    function n() {
        let n = [
            "A",
            "B",
            "C"
        ];
        let u = [
            2,
            1,
            0
        ].map((u)=>t(n[u] + u));
        return u;
    }
    function t(n) {
        return ()=>console.log(n);
    }
    n().map((n)=>n());
})();
