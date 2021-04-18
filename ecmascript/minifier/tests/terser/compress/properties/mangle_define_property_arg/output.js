var some_prop = "propname";

const object = {
  o: some_prop,
};

const non_global_console = console;

// .log gets preserved because of jsprops
non_global_console.log(object);

Object.defineProperty(object, "o", { value: 3 });
Object.defineProperty(non_global_console, "l", { value: 3 });
Object.defineProperty(console, "l", { value: 3 });
