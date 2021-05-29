var some_prop = "propname";

const object = {
    some_prop,
};

const non_global_console = console;

// .log gets preserved because of jsprops
non_global_console.log(object);

Object.defineProperty(object, "some_prop", { value: 3 });
Object.defineProperty(non_global_console, "lag", { value: 3 });
Object.defineProperty(console, "lag", { value: 3 });
