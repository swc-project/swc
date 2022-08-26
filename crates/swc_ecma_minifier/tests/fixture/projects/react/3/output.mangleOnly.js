function n(n) {
    {
        for(var _ = arguments.length, r = new Array(_ > 1 ? _ - 1 : 0), a = 1; a < _; a++){
            r[a - 1] = arguments[a];
        }
        printWarning("warn", n, r);
    }
}
