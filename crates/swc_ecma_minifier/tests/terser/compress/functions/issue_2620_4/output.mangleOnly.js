var a = "FAIL";
(function() {
    function b(c, d) {
        function b() {
            switch(c){
                case c:
                    break;
                case ((a = "PASS"), NaN):
                    break;
            }
        }
        b();
    }
    b(0 / 0);
})();
console.log(a);
