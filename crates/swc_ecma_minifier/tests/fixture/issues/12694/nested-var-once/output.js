!function() {
    try {
        var t = 11;
    } catch (e) {}
    console.log("try", t);
    for(var k = 0; k++ < 1;)var w = 12;
    console.log("while", w), console.log("do", 13);
    for(var i = 10; i < 12; i++);
    for(var p in console.log("for", i), {
        10: 1
    });
    for (var o of (console.log("for-in", p), [
        10,
        14
    ]));
    console.log("for-of", o);
    l: {
        var b = 15;
        break l;
    }
    console.log("labeled", b);
}();
