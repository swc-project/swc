//// [parser_duplicateLabel3.ts]
target: while(true){
    var f = function f() {
        target: while(true){}
    };
}
