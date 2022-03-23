function bar(fooArg) {
    switch(true){
        case true:
            var fooArg1 = "test"; // should rename
            return "bar() result";
    }
}
console.log(bar());
