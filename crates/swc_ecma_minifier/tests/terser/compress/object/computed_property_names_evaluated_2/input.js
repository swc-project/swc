var foo = something();
var obj = {
    [foo]() {
        return "blah";
    },
};
