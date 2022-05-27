(function() {
    return (function(a) {
        return a();
    })(()=>{
        console.log(this.message);
    });
}.call({
    message: "PASS"
}));
