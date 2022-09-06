global.a = (
    (...o) =>
    (o, a) =>
        o.foo === a.foo
)(...args);
