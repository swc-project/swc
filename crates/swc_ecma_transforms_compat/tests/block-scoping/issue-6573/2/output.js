var _loop__7 = function(i__2) {
    var _loop__6 = function(j__3) {
        funcs__1.push(()=>console.log(i__2, j__3));
    };
    for(var j__3 in [
        1,
        2
    ])_loop__6(j__3);
};
var funcs__1 = [];
for(var i__2 in [
    1,
    2
])_loop__7(i__2);
funcs__1.forEach((f__5)=>f__5());
