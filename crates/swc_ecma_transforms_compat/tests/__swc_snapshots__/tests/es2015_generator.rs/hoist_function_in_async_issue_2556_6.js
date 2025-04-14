function foo(a) {
    return /*#__PURE__*/ _async_to_generator(function() {
        function bar1(b) {
            return /*#__PURE__*/ _async_to_generator(function() {
                return _ts_generator(this, function(_state) {
                    return [
                        2,
                        a + b
                    ];
                });
            })();
        }
        return _ts_generator(this, function(_state) {
            return [
                2,
                bar1
            ];
        });
    })();
}
foo(1).then((t)=>t(2)).then(console.log);
