const thing = {
    get "a-b"() {
        return "abc";
    },
};
console.log(thing['a-b']);