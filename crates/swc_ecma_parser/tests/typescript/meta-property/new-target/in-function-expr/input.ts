const f1 = function () {
    new.target;
};

const f2 = function () {
    const a = () => {
        new.target;
    };
};
