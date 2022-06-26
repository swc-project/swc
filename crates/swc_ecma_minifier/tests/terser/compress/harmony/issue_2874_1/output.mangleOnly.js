(function() {
    function a() {
        let a = [
            "A",
            "B",
            "C"
        ];
        let c = [
            2,
            1,
            0
        ].map((c)=>b(a[c] + c));
        return c;
    }
    function b(a) {
        return ()=>console.log(a);
    }
    a().map((a)=>a());
})();
