var _loop = function(i) {
    if (i === 0) return "continue|out";
    if (i === 1) return "break|out";
    [
        1
    ].forEach((_)=>{
        console.log(i);
    });
};
out: for(var i = 0; i < 2; i++){
    var _ret = _loop(i);
    if (_ret === "break|out") break out;
    if (_ret === "continue|out") continue out;
}
