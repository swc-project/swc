var _loop__9 = function(i__1) {
    var _loop__7 = function(j__3) {
        if (i__1 < 2) return "continue|b";
        [
            1
        ].forEach((___5)=>{
            console.log(i__1, j__3);
        });
    };
    b__0: for(var j__3 = 0; j__3 < 4; ++j__3){
        var _ret__8 = _loop__7(j__3);
        switch(_ret__8){
            case "continue|b":
                continue b__0;
        }
    }
};
for(var i__1 = 0; i__1 < 4; i__1++)_loop__9(i__1);
