(function () {
    ((x) => {
        console.log.apply(console, arguments), console.log(x);
    })(4);
})(3, 2, 1);
