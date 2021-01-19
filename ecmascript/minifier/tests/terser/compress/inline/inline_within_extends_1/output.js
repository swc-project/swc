console.log(
    new (class extends (function (foo_base) {
        return class extends foo_base {};
    })(
        (function (bar_base) {
            return class extends bar_base {};
        })(Array)
    ) {})().concat(["PASS"])[0]
);
