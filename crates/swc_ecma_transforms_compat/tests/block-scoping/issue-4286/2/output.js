var _loop = function(i) {
    Promise.resolve().then(()=>{
        console.log(`async: ${i}`);
    });
};
for (var i of [
    1,
    2,
    3
])_loop(i);
