var b = {
    get b() {
        throw 0;
    },
};
({ ...b }.b);
