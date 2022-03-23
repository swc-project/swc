"use strict";
var swcHelpers = require("@swc/helpers");
const SampleData = typedModel("SampleVideo", VideosSchema, undefined, undefined, {
    byPlatform: function() {
        var _ref = swcHelpers.asyncToGenerator(function*(platform) {
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
