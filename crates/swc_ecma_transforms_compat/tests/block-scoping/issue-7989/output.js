async function foo__2(a__3, b__3) {
    var _loop__6 = async function(i__4) {
        var boo__5 = await a__3();
        b__3(()=>boo__5);
    };
    for(var i__4 = 0; i__4 < 5; i__4++)await _loop__6(i__4);
}
