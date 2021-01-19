console.log(
    new (class extends (function (base) {
        return class extends base {};
    })(Error) {})() instanceof Error
);
