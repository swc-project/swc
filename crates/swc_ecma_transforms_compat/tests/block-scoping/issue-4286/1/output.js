console.log([
    ...function*() {
        var _loop__3 = function*(i__2) {
            Promise.resolve().then(()=>{
                console.log(`async: ${i__2}`);
            });
            yield i__2;
        };
        for (var i__2 of [
            1,
            2,
            3
        ])yield* _loop__3(i__2);
    }()
]);
