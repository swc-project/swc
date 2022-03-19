var some_prop = "propname";
const object = {
    a: some_prop
};
const non_global_console = console;
non_global_console.log(object);
Object.defineProperty(object, , {
    value: 3
});
Object.defineProperty(non_global_console, , {
    value: 3
});
Object.defineProperty(console, , {
    value: 3
});
