!(function() {
    var a = {};
    console.log(([a.a] = [
        42
    ])[0]);
})();
