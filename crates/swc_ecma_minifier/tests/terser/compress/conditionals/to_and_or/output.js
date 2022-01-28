var values = [0, null, true, "foo", false, -1 / 0, void 0];
values.forEach(function(x) {
    values.forEach(function(y) {
        values.forEach(function(z) {
            console.log(x && y || z);
        });
    });
});
