var obj = {
    async a() {
        await foo(1 + 0);
    },
    anon: async function () {
        await foo(2 + 0);
    },
};
