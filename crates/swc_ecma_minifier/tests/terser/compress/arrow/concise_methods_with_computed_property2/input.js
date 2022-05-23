var foo = {
    [[1]](v) {
        return v;
    },
};
console.log(foo[[1]]("PASS"));
