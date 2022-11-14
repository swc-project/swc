var _loop__7 = function(i__1) {
    var _loop__5 = function(j__2) {
        if (i__1 > 2) return "break";
        [
            1
        ].forEach((___3)=>{
            console.log(i__1, j__2);
        });
    };
    for(var j__2 = 0; j__2 < 4; ++j__2){
        var _ret__6 = _loop__5(j__2);
        if (_ret__6 === "break") break;
    }
};
for(var i__1 = 0; i__1 < 4; i__1++)_loop__7(i__1);
