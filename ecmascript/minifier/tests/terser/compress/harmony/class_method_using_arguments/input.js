console.log(
    new (class {
        m() {
            return arguments[0];
        }
    })().m("PASS")
);
