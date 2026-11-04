var _loop = function(i) {
    if (i === 0) return "continue|a";
    if (i === 1) return "break|b";
    [
        1
    ].forEach((_)=>{
        console.log(i);
    });
};
a: b: for(var i = 0; i < 2; i++){
    var _ret = _loop(i);
    switch(_ret){
        case "continue|a":
            continue a;
        case "break|b":
            break b;
    }
}
