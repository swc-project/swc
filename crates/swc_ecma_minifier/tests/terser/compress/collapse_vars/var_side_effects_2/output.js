var print = console.log.bind(console);
function foo(x) {
    print("Foo:", 2 * x.y);
}
foo({
    y: 10
});
