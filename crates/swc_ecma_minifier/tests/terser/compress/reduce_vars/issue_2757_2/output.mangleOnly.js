(function() {
    let n;
    const o = function() {
        n = true;
    };
    if (!n) {
        console.log(1);
    }
    console.log(2);
})();
