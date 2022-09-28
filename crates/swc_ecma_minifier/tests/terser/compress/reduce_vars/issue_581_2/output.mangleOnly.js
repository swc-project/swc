(function() {
    return (function(e) {
        return e();
    })(()=>{
        console.log(this.message);
    });
}.call({
    message: "PASS"
}));
