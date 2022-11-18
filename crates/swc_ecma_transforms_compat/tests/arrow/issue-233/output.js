const foo = function() {
    return function({ x , ...y }) {
        return y;
    };
};
