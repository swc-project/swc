var _loop__6 = function(i__3) {
    Promise.resolve().then(()=>{
        console.log(`async: ${i__3}`);
    });
};
for (var i__3 of [
    1,
    2,
    3
])_loop__6(i__3);
