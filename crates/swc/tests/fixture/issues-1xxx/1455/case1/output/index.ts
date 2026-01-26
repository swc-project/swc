"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _async_to_generator = require("@swc/helpers/_/_async_to_generator");
const SampleData = typedModel("SampleVideo", VideosSchema, undefined, undefined, {
    byPlatform: function(platform) {
        return _async_to_generator._(function*() {
            const result = yield this.find({
                platform: {
                    $eq: platform
                }
            });
            return result;
        }).call(this);
    }
});
SampleData.byPlatform("youtube").then((res)=>{
    console.info(res);
});
