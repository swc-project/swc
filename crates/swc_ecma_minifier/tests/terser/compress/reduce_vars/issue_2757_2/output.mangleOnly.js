(function() {
    let a;
    const b = function() {
        a = true;
    };
    if (!a) {
        console.log(1);
    }
    console.log(2);
})();
