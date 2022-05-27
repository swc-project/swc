function a(d) {
    {
        for(var b = arguments.length, c = new Array(b > 1 ? b - 1 : 0), a = 1; a < b; a++){
            c[a - 1] = arguments[a];
        }
        printWarning("warn", d, c);
    }
}
