const obj = {
    find({ platform }) {
        return { platform }
    },
    byPlatform: async function (platform) {
        const result = await this.find({ platform: { $eq: platform } });
        return result;
    },
};

console.log(obj.byPlatform('foo'));