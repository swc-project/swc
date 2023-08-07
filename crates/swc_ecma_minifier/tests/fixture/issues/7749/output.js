let depth = 0;
blackbox(function(n) {
    depth += 1;
    let k = visit(n);
    return depth -= 1, k;
});
