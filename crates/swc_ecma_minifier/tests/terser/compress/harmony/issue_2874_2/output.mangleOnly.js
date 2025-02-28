(function() {
    let r = [];
    function n() {
        var n = [
            2,
            1,
            0
        ].map((n)=>{
            r.push(n);
            return t();
        });
        return n;
    }
    function t() {
        var n = [
            "A",
            "B",
            "C"
        ], t = r.shift();
        return ()=>console.log(n[t] + t);
    }
    n().map((n)=>n());
})();
