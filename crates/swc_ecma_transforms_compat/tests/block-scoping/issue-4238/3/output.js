var _loop__10 = function(i__3) {
    var _loop__8 = function(j__5) {
        if (i__3 > 2) return "break|out";
        [
            1
        ].forEach((___7)=>{
            console.log(i__3, j__5);
        });
    };
    for(var j__5 = 0; j__5 < 4; ++j__5){
        var _ret__9 = _loop__8(j__5);
        switch(_ret__9){
            case "break|out":
                return "break|out";
        }
    }
};
out__0: for(var i__3 = 0; i__3 < 4; i__3++){
    var _ret__11 = _loop__10(i__3);
    switch(_ret__11){
        case "break|out":
            break out__0;
    }
}
