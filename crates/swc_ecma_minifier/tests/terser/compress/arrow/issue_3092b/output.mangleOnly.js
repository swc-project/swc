var a = {
    async bar (a) {
        return await a, 2;
    },
    *gen (a) {
        return yield a.toUpperCase(), 2;
    }
};
console.log(a.gen("pass").next().value);
