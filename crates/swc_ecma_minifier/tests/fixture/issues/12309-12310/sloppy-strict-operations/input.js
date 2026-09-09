function report(label, callback) {
    try {
        callback();
        console.log(label, "no error");
    } catch (error) {
        console.log(label, error.name);
    }
}

report("field", () => {
    (class { static value = unresolved_public_field = 1; });
});

report("block", () => {
    (class {
        static {
            unresolved_static_block = 1;
        }
    });
});

report("private", () => {
    (class { static #value = unresolved_private_field = 1; });
});

report("delete", () => {
    (class { static value = delete Object.prototype; });
});

console.log(
    typeof unresolved_public_field,
    typeof unresolved_static_block,
    typeof unresolved_private_field,
);
