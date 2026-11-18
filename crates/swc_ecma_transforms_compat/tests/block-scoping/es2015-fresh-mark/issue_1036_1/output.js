async function foo() {
    await Promise.all([
        [
            1
        ],
        [
            2
        ],
        [
            3
        ]
    ].map(async function(param) {
        var _param = _sliced_to_array(param, 1), a = _param[0];
        return Promise.resolve().then(function() {
            return a * 2;
        });
    }));
}
