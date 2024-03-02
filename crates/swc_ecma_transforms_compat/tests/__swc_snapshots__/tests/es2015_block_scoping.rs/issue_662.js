function foo(parts) {
    var match = null;
    for(var i = 1; i >= 0; i--){
        for(var j = 0; j >= 0; j--){
            match = parts[i][j];
            if (match) {
                break;
            }
        }
        if (match) {
            break;
        }
    }
    return match;
}
foo();
