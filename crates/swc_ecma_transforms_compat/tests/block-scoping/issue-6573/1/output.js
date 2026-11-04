var _loop__8 = function(i__3) {
    var _loop__7 = function(j__4) {
        funcs__2.push(()=>console.log(i__3, j__4));
    };
    for(var j__4 = 0; j__4 < 2; j__4++)_loop__7(j__4);
};
var funcs__2 = [];
for(var i__3 = 0; i__3 < 2; i__3++)_loop__8(i__3);
funcs__2.forEach((f__6)=>f__6());
