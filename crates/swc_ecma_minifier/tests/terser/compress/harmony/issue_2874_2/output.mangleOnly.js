(function() {
    let a = [];
    function b() {
        var b = [
            2,
            1,
            0
        ].map((b)=>{
            a.push(b);
            return c();
        });
        return b;
    }
    function c() {
        var b = [
            "A",
            "B",
            "C"
        ], c = a.shift();
        return ()=>console.log(b[c] + c);
    }
    b().map((a)=>a());
})();
