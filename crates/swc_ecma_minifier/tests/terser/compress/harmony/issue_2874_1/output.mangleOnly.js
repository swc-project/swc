(function() {
    function n() {
        let o = [
            "A",
            "B",
            "C"
        ];
        let n = [
            2,
            1,
            0
        ].map((n)=>t(o[n] + n));
        return n;
    }
    function t(n) {
        return ()=>console.log(n);
    }
    n().map((n)=>n());
})();
