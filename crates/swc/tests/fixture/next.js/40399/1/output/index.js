import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
_async_to_generator(function() {
    var blob, _;
    return _ts_generator(this, function(_state) {
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
