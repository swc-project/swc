(function () {
    let bar;
    const unused = function () {
        bar = true;
    };
    if (!bar) {
        console.log(1);
    }
    console.log(2);
})();
