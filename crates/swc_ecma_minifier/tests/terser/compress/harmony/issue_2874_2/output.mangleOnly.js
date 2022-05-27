(function() {
    let b = [];
    function a() {
        var a = [
            2,
            1,
            0
        ].map((a)=>{
            b.push(a);
            return c();
        });
        return a;
    }
    function c() {
        var a = [
            "A",
            "B",
            "C"
        ], c = b.shift();
        return ()=>console.log(a[c] + c);
    }
    a().map((a)=>a());
})();
