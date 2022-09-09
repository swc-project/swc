var e = {
    async bar(e) {
        return await e, 2;
    },
    *gen(e) {
        return yield e.toUpperCase(), 2;
    },
};
console.log(e.gen("pass").next().value);
