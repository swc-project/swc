function foo(anything) {
    function throwing_function() {
        throw "nope";
    }
    try {
        console.log("0" + throwing_function() ? "yes" : "no");
    } catch (ex) {
        console.log(ex);
    }
    console.log("0" + anything ? "yes" : "no");
    console.log(anything + "0" ? "Yes" : "No");
    console.log("" + anything);
    console.log(anything + "");
}
foo();
