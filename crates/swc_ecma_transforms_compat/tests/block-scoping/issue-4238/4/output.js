var _loop__10 = function(i__3) {
    var _loop__8 = function(j__5) {
        if (i__3 > 2) return "break";
        [
            1
        ].forEach((___7)=>{
            console.log(i__3, j__5);
        });
    };
    for(var j__5 = 0; j__5 < 4; ++j__5){
        var _ret__9 = _loop__8(j__5);
        if (_ret__9 === "break") break;
    }
};
for(var i__3 = 0; i__3 < 4; i__3++)_loop__10(i__3);
