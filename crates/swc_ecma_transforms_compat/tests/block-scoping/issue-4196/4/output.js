out: while(true){
    var _loop = function(i) {
        if (i === 0) return "continue|inner";
        if (i === 1) return "break|out";
        [
            1
        ].forEach((_)=>{
            console.log(i);
        });
    };
    inner: for(var i = 0; j < 2; j++){
        var _ret = _loop(i);
        if (_ret === "break|out") break out;
        if (_ret === "continue|inner") continue inner;
    }
}
