var _loop = function(i) {
    var _loop1 = function(j) {
        if (i > 2) return "break";
        [
            1
        ].forEach((_)=>{
            console.log(i, j);
        });
    };
    for(var j = 0; j < 4; ++j){
        var _ret = _loop1(j);
        if (_ret === "break") break;
    }
};
for(var i = 0; i < 4; i++)_loop(i);
