//// [genericRestArity.ts]
// Repro from #25559
call(function(x, y) {
    return x + y;
}), call(function(x, y) {
    return x + y;
}, 1, 2, 3, 4, 5, 6, 7);
