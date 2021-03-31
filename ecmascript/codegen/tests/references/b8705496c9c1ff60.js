(function() {
    var a = {
    };
    with (a){
        (1, b)(); // Don't transform it to test()
    }
/*
 * var obj = {
 *   test: function() {
 *     print(obj === this);
 *   }
 * };
 * with (obj) {
 *   test();  // true
 *   (0, test)();  // false
 * }
 */ }());
