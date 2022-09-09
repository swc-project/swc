function n(n) {
    {
        for(var r = arguments.length, a = new Array(r > 1 ? r - 1 : 0), i = 1; i < r; i++){
            a[i - 1] = arguments[i];
        }
        printWarning("warn", n, a);
    }
}
