try {
    (class {
        static value = eval("with ({}) {}");
    });
} catch (error) {
    console.log("eval", error.name);
}
try {
    (class {
        [undeclared = 1]() {}
    });
} catch (error) {
    console.log("key", error.name);
}
const target = {};
Object.defineProperty(target, "value", {
    value: 0
});
try {
    (class {
        static value = target.value++;
    });
} catch (error) {
    console.log("update", error.name);
}
(class {
    static value = console.log("new-target", new.target);
});
