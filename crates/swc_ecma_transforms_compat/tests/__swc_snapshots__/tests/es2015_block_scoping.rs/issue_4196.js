var _loop = function(i) {
    if (i === 0) return "continue";
    if (i === 1) return "break";
    [
        1
    ].forEach((_)=>{
        console.log(i);
    });
};
for(var i = 0; i < 2; i++){
    var _ret = _loop(i);
    if (_ret === "break") break;
}
