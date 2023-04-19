(function () {

    const r = f();
    console.log(r)

    function f() {
        console.log("REQUIRE")
        return 1
    }
})();
