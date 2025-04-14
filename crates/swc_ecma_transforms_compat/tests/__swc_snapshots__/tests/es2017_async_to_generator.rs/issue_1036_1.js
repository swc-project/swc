const x = function() {
    return /*#__PURE__*/ _async_to_generator(function*() {
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
        ].map(([a])=>/*#__PURE__*/ _async_to_generator(function*() {
                return Promise.resolve().then(()=>a * 2);
            })()))));
    })();
};
