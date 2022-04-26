function foo(l, r) {
    var lightGreeting;
    if (l > 0) {
        var greeting = "hello";
    } else {
        var greeting = "howdy";
    }
    if (r > 0) {
        lightGreeting = greeting.substr(0, 2);
    }
    return lightGreeting;
}
module.exports = foo;
