var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
const SampleData = typedModel("SampleVideo", VideosSchema, undefined, undefined, {
    byPlatform: /*#__PURE__*/ function() {
        var _ref = _async_to_generator._(function*(platform) {
            const result = yield this.find({
                platform: {
                    $eq: platform
                }
            });
            return result;
        });
        return function(platform) {
            return _ref.apply(this, arguments);
        };
    }()
});
SampleData.byPlatform("youtube").then((res)=>{
    console.info(res);
});
