var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var obj = {
    find: function find(param) {
        var platform = param.platform;
        return {
            platform: platform
        };
    },
    byPlatform: /*#__PURE__*/ function() {
        var _ref = _async_to_generator._(function(platform) {
            var result;
            return _ts_generator._(this, function(_state) {
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
        });
        return function(platform) {
            return _ref.apply(this, arguments);
        };
    }()
};
obj.byPlatform("foo").then(function(v) {
    return console.log(v);
});
