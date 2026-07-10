new function() {
    throw 1;
}(), new function() {
    throw 1;
}(foo()), new function() {
    console.log(arguments[0]);
}("keep"), new function() {
    eval("arguments[0]");
}("keep"), new function(x) {
    console.log(x);
}("keep"), new function() {
    throw 1;
}(...xs), new function(...args) {
    console.log(args.length);
}("keep", "also_keep"), new Foo("keep"), new function(x) {
    console.log(x);
}(...xs, "keep"), new function() {
    console.log(this.constructor.arguments.length);
}("keep"), new function F() {
    console.log(F.arguments.length);
}("keep"), new function F() {
    leak(F);
}("keep"), new function() {
    leak(this);
}("keep"), new function() {
    console.log(new.target.arguments.length);
}("keep"), new function() {
    with (obj)console.log(value);
}("keep");
