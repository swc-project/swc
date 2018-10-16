(function () {
    switch (a) {
        case 1:
            b("c");
        default:
            // drop this default clause
            // https://github.com/mishoo/UglifyJS2/issues/141
    }
}());
