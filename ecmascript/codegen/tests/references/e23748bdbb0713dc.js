(function() {
    function a() {
        b.c('d');
    }
    {
        function a() {
            b.c('e');
        }
    }
}());
