var a = {
    set b() {
        throw 0;
    },
};
({ ...a }.b);
