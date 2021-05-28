function foo(anything) {
    function throwing_function() {
        throw "nope";
    }
    try {
        console.log((throwing_function(), "yes"));
    } catch (ex) {
        console.log(ex);
    }
    console.log("yes");
    console.log("Yes");
    console.log("" + anything);
    console.log(anything + "");
}
foo();
