function foo(a) {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function(a) {
        function bar1(b) {
            return _bar1.apply(this, arguments);
        }
        function _bar1() {
            _bar1 = _async_to_generator(function(b) {
                return _ts_generator(this, function(_state) {
                    return [
                        2,
                        a + b
                    ];
                });
            });
            return _bar1.apply(this, arguments);
        }
        return _ts_generator(this, function(_state) {
            return [
                2,
                bar1
            ];
        });
    });
    return _foo.apply(this, arguments);
}
foo(1).then((t)=>t(2)).then(console.log);
