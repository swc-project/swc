function a(a) {
    {
        for(var b = arguments.length, c = new Array(b > 1 ? b - 1 : 0), d = 1; d < b; d++){
            c[d - 1] = arguments[d];
        }
        printWarning("warn", a, c);
    }
}
