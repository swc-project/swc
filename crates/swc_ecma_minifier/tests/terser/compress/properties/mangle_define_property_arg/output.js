var some_prop = "propname";
const object = {
    o: some_prop
};
const non_global_console = console;
non_global_console.log(object);
Object.defineProperty(object, "o", {
    value: 3
});
Object.defineProperty(non_global_console, "e", {
    value: 3
});
Object.defineProperty(console, "e", {
    value: 3
});
