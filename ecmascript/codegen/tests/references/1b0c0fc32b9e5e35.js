// reported from issue #60
void function() {
    var a; // this foo should be dropped
    a = function() {
        return 1;
    };
}.b(this);
