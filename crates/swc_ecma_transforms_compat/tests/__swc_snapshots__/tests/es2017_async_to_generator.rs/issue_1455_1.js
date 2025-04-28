const obj = {
    find ({ platform }) {
        return {
            platform
        };
    },
    byPlatform: function(platform) {
        return _async_to_generator(function*() {
            const result = yield this.find({
                platform: {
                    $eq: platform
                }
            });
            return result;
        }).call(this);
    }
};
obj.byPlatform('foo').then((v)=>console.log(v));
