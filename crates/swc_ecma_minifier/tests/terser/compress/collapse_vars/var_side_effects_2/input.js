var print = console.log.bind(console);
function foo(x) {
    var twice = x.y * 2;
    print("Foo:", twice);
}
foo({ y: 10 });
