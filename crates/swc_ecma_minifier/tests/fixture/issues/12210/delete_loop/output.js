function f(a) {
    for(var i = 0; i < 2; i++){
        console.log(arguments[0]);
        delete arguments[0];
    }
}
f(1);
