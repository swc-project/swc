var c = "FAIL";
(function() {
    function n(n, a) {
        function o() {
            switch(n){
                case n:
                    break;
                case ((c = "PASS"), NaN):
                    break;
            }
        }
        o();
    }
    n(0 / 0);
})();
console.log(c);
