var obj = {
    async a() {
        await foo(1);
    },
    anon: async function () {
        await foo(2);
    },
};
