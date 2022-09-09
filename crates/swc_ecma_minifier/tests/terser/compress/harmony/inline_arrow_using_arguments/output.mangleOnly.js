(function () {
    ((o) => {
        console.log.apply(console, arguments), console.log(o);
    })(4);
})(3, 2, 1);
