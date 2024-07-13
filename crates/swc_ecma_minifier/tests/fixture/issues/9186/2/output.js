console.log((()=>{
    while(true){
        console.log(123);
    }
})());
console.log(function(a = this.a) {
    while(true){
        console.log(123);
    }
}());
