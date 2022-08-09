var c = "FAIL";
(function() {
    function n(n, a) {
        function e() {
            switch(n){
                case n:
                    break;
                case ((c = "PASS"), NaN):
                    break;
            }
        }
        e();
    }
    n(0 / 0);
})();
console.log(c);
