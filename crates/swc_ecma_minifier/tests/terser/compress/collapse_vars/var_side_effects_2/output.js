var print = console.log.bind(console);
function foo(x) {
    var twice = 2 * x.y;
    print("Foo:", twice);
}
foo({ y: 10 });
