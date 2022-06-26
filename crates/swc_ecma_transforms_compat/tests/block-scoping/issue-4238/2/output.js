var _loop = function(i) {
    var _loop = function(j) {
        if (i < 2) return "continue";
        [
            1
        ].forEach((_)=>{
            console.log(i, j);
        });
    };
    for(var j = 0; j < 4; ++j)_loop(j);
};
for(var i = 0; i < 4; i++)_loop(i);
