var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
_async_to_generator._(function() {
    var blob, _;
    return _ts_generator._(this, function(_state) {
        switch(_state.label){
            case 0:
                blob = new Blob();
                _ = Uint8Array.bind;
                return [
                    4,
                    blob.arrayBuffer()
                ];
            case 1:
                new (_.apply(Uint8Array, [
                    void 0,
                    _state.sent()
                ]));
                console.log("Success");
                return [
                    2
                ];
        }
    });
})();
