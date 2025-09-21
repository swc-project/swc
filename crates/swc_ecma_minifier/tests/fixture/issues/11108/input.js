this.test = function (a) {
    return (0 | !(a < 0)) ^ ((a < 0) << 8);
};
