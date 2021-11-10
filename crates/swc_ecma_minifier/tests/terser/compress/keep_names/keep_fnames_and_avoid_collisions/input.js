global.t = "ttttttttttttttttttttt";
(function testBug() {
    var param1 = "PASS";
    return () => {
        console.log(param1);
        var t = function () {};
        return t;
    };
})()();
