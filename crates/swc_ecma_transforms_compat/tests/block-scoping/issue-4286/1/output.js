console.log([
    ...function*() {
        var _loop__6 = function*(i__3) {
            Promise.resolve().then(()=>{
                console.log(`async: ${i__3}`);
            });
            yield i__3;
        };
        for (var i__3 of [
            1,
            2,
            3
        ])yield* _loop__6(i__3);
    }()
]);
