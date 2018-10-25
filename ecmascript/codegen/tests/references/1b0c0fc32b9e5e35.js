void function() {
    var // this foo should be droppeda ;
    a = function() {
        return 1;
    };
}.b(this);
