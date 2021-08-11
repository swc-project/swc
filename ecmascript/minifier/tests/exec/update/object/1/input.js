console.log(function () {
    console.log({
        q: {
            p: 8
        }
    }.q.p++);
    return 8;
}());