var some_prop = "propname";

const object = {
    a: some_prop,
};

const non_global_console = console;

// .log gets preserved because of jsprops
non_global_console.log(object);

Object.defineProperty(object, "a", { value: 3 });
Object.defineProperty(non_global_console, "b", { value: 3 });
Object.defineProperty(console, "b", { value: 3 });
