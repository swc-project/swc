var myFunction = function() {
    var _loop = function(j) {
        for(var _i = 0, _iter = []; _i < _iter.length; _i++){
            var _ = _iter[_i];
        }
        if (j === 1) {
            console.log("before set timeout, j is:", j);
            setTimeout(function() {
                console.log("in timeout: j is", j);
            }, 50);
        }
    };
    for(var j = 0; j <= 3; j++)_loop(j);
    return null;
};
myFunction();
