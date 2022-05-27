a["foo"] = "bar";
a.color = "red";
x = {
    bar: 10
};
a.run(x.bar, a.foo);
a["run"]({
    color: "blue",
    foo: "baz"
});
