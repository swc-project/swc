const x = function() {
    return _async_to_generator(function*() {
        console.log((yield Promise.all([
            [
                1
            ],
            [
                2
            ],
            [
                3
            ]
        ].map(([a])=>_async_to_generator(function*() {
                return Promise.resolve().then(()=>a * 2);
            })()))));
    })();
};
