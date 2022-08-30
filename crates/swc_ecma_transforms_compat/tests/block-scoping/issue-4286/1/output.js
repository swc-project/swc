console.log([
    ...function*() {
        var _loop = function(i) {
            Promise.resolve().then(()=>{
                console.log(`async: ${i}`);
            });
            yield i;
        };
        for (var i of [
            1,
            2,
            3
        ])_loop(i);
    }(), 
]);
