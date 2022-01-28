var foo = {
    [[1]]() {
        return "success";
    },
};
doSomething(foo[[1]]());
