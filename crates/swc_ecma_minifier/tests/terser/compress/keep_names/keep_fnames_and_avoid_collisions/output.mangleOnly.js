global.t = "ttttttttttttttttttttt";
(function a() {
    var b = "PASS";
    return ()=>{
        console.log(b);
        var a = function() {};
        return a;
    };
})()();
