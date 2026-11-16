function get() {
    console.log("get");
    return [];
}
function outer() {
    console.log(
        (function () {
            var [] = get();
            return 1;
        })()
    );
}
outer();
