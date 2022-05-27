(function() {
    function a() {
        let c = [
            "A",
            "B",
            "C"
        ];
        let a = [
            2,
            1,
            0
        ].map((a)=>b(c[a] + a));
        return a;
    }
    function b(a) {
        return ()=>console.log(a);
    }
    a().map((a)=>a());
})();
