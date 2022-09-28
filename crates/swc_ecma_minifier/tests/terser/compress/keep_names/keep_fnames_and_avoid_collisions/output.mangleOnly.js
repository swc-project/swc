global.t = "ttttttttttttttttttttt";
(function t() {
    var n = "PASS";
    return ()=>{
        console.log(n);
        var t = function() {};
        return t;
    };
})()();
