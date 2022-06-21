"use strict";
var _asyncToGeneratorMjs = require("@swc/helpers/lib/_async_to_generator.js").default;
const SampleData = typedModel("SampleVideo", VideosSchema, undefined, undefined, {
    byPlatform: function() {
        var _ref = _asyncToGeneratorMjs(function*(platform) {
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
