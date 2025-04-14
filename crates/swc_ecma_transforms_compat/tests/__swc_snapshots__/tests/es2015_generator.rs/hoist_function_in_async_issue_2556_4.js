function requester() {
    return pureRequester;
    function pureRequester() {
        return /*#__PURE__*/ _async_to_generator(function() {
            function refreshThenRequest() {
                return /*#__PURE__*/ _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                })();
            }
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            refreshThenRequest()
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2,
                            true
                        ];
                }
            });
        })();
    }
}
