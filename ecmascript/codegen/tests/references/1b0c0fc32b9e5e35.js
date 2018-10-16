// reported from issue #60
void function () {
  var a;  // this foo should be dropped
  a = function () {  // this should be transformed to non-assignment expression
    return 1;
  };
}.b(this);
