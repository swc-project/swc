const obj = {
    find ({ platform }) {
        return {
            platform
        };
    },
    byPlatform: /*#__PURE__*/ function() {
        var _ref = _async_to_generator(function*(platform) {
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
};
obj.byPlatform('foo').then((v)=>console.log(v));
