const x = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function*() {
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
        ].map(/*#__PURE__*/ function() {
            var _ref = _async_to_generator(function*([a]) {
                return Promise.resolve().then(()=>a * 2);
            });
            return function(_) {
                return _ref.apply(this, arguments);
            };
        }()))));
    });
    return function x() {
        return _ref.apply(this, arguments);
    };
}();
