import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
var obj = {
    find: function find(param) {
        var platform = param.platform;
        return {
            platform: platform
        };
    },
    byPlatform: function byPlatform(platform) {
        return _async_to_generator(function() {
            var result;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            this.find({
                                platform: {
                                    $eq: platform
                                }
                            })
                        ];
                    case 1:
                        result = _state.sent();
                        return [
                            2,
                            result
                        ];
                }
            });
        }).call(this);
    }
};
obj.byPlatform("foo").then(function(v) {
    return console.log(v);
});
