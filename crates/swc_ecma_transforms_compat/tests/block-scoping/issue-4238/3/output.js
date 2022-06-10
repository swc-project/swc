var _loop = function(i) {
    var _loop1 = function(j) {
        if (i > 2) return "break|out";
        [
            1
        ].forEach((_)=>{
            console.log(i, j);
        });
    };
    for(var j = 0; j < 4; ++j){
        var _ret1 = _loop1(j);
        switch(_ret1){
            case "break|out":
                return "break|out";
        }
    }
};
out: for(var i = 0; i < 4; i++){
    var _ret = _loop(i);
    switch(_ret){
        case "break|out":
            break out;
    }
}
