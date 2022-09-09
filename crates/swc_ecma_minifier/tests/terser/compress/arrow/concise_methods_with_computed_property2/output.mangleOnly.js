var o = {
    [[1]](o) {
        return o;
    },
};
console.log(o[[1]]("PASS"));
