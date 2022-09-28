var a = {
    async a () {
        return await foo(1 + 0);
    },
    anon: async function() {
        return await foo(2 + 0);
    }
};
