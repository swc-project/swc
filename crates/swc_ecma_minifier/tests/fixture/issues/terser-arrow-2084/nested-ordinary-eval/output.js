var fn = (value)=>{
    function helper() {
        return eval("arguments.length");
    }
    return value + helper();
};
(()=>{
    (()=>{
        function nested() {
            return eval("arguments.length");
        }
        console.log(nested());
    })();
})();
