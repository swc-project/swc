console.log([
    ...function*() {
        var _loop__7 = function*(i__4) {
            Promise.resolve().then(()=>{
                console.log(`async: ${i__4}`);
            });
            yield i__4;
        };
        for (var i__4 of [
            1,
            2,
            3
        ])yield* _loop__7(i__4);
    }()
]);
