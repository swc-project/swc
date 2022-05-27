var a = {
    get b () {
        throw 0;
    }
};
({
    ...a
}.b);
