import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var obj = {
    find: function find(param) {
        var platform = param.platform;
        return {
            platform: platform
        };
    },
    byPlatform: function() {
        var _ref = _async_to_generator(function(platform) {
            var result, _tmp;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _tmp = {};
                        return [
                            4,
                            this.find((_tmp.platform = {
                                $eq: platform
                            }, _tmp))
                        ];
                    case 1:
                        result = _state.sent();
                        return [
                            2,
                            result
                        ];
                }
            });
        });
        return function(platform) {
            return _ref.apply(this, arguments);
        };
    }()
};
obj.byPlatform("foo").then(function(v) {
    return console.log(v);
});
