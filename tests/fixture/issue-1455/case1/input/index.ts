const SampleData = typedModel("SampleVideo", VideosSchema, undefined, undefined, {
    byPlatform: async function (platform: string) {
        const result = await this.find({ platform: { $eq: platform } });
        return result;
    },
});

SampleData.byPlatform("youtube").then((res) => {
    console.info(res);
});