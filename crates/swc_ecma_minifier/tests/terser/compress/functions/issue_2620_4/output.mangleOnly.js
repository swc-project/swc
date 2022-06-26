var a = "FAIL";
(function() {
    function b(b, c) {
        function d() {
            switch(b){
                case b:
                    break;
                case ((a = "PASS"), NaN):
                    break;
            }
        }
        d();
    }
    b(0 / 0);
})();
console.log(a);
