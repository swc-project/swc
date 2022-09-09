(function () {
    let o;
    const n = function () {
        o = true;
    };
    if (!o) {
        console.log(1);
    }
    console.log(2);
})();
