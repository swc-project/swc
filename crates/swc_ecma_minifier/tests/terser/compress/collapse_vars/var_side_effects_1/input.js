var print = console.log.bind(console);
function foo(x) {
    var twice = x * 2;
    print("Foo:", twice);
}
foo(10);
