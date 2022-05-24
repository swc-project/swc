var _loop = function(i) {
    var _loop1 = function(j) {
        if (i < 2) return "continue|b";
        [
            1
        ].forEach((_)=>{
            console.log(i, j);
        });
    };
    b: for(var j = 0; j < 4; ++j){
        var _ret = _loop1(j);
        switch(_ret){
            case "continue|b":
                continue b;
        }
    }
};
for(var i = 0; i < 4; i++)_loop(i);
