export default function Foo() {
    return call(/*#__PURE__*/ function() {
        var _ref = _async_to_generator(function(e) {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            doSomething()
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        });
        return function(e) {
            return _ref.apply(this, arguments);
        };
    }());
}
