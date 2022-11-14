var _loop__3 = function(i__1) {
    Promise.resolve().then(()=>{
        console.log(`async: ${i__1}`);
    });
};
for (var i__1 of [
    1,
    2,
    3
])_loop__3(i__1);
