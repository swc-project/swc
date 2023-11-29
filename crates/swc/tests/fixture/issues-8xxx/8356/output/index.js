const obj = {
    async *asyncYield () {
        return await (yield* nestedAsyncYield());
    }
};
