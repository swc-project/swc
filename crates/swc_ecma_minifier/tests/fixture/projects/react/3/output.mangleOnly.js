function n(n) {
    {
        for(var _ = arguments.length, e = new Array(_ > 1 ? _ - 1 : 0), f = 1; f < _; f++){
            e[f - 1] = arguments[f];
        }
        printWarning("warn", n, e);
    }
}
