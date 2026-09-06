var c = 100, log = [];
!(function () {
    !(function (c) {
        c = 1 + c;
        log.push(c);
        var c = 0;
        log.push(c);
        function f14(a) {
            if ((log.push(c = 1 + c), 0 !== (23).toString())) {
                log.push(c = 1 + c);
                a && (a[0] = 0);
            }
        }
        f14();
    })(-1);
})();
console.log(log.join(','), c);
