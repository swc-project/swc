var fn = (value)=>{
    function helper() {
        return eval("arguments.length");
    }
    return value + helper();
};
